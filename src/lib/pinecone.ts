// Pinecone Vector Store Client
// Full implementation for Arxiv Pulse

import { ArxivPaper } from './arxiv';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENV = process.env.PINECONE_ENV || 'us-east-1';
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'arxiv-pulse';

interface PaperEmbedding {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  categories: string[];
  score?: number;
}

// Generate embedding using Pinecone's text embedding v2
async function getEmbedding(text: string): Promise<number[]> {
  if (!PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY not set');
  }

  const response = await fetch(
    `https://${PINECONE_INDEX}-${PINECONE_ENV}.svc.pinecone.io/text-embeddings`,
    {
      method: 'POST',
      headers: {
        'Api-Key': PINECONE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: [text],
        model: 'multilingual-e5-large',
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Pinecone embedding error: ${response.status}`);
  }

  const data = await response.json();
  return data.embeddings?.[0]?.values || [];
}

// Fallback: Generate simple hash-based embedding
function getLocalEmbedding(text: string): number[] {
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Convert hash to fixed-length vector
  const vector = [];
  let seed = Math.abs(hash);
  for (let i = 0; i < 384; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    vector.push(seed / 0x7fffffff);
  }
  return vector;
}

export async function embedText(text: string): Promise<number[]> {
  try {
    return await getEmbedding(text);
  } catch (error) {
    console.warn('[Pinecone] Using local embedding fallback');
    return getLocalEmbedding(text);
  }
}

export async function storePaper(paper: ArxivPaper): Promise<boolean> {
  if (!PINECONE_API_KEY) {
    console.warn('[Pinecone] API key not set - skipping storage');
    return false;
  }

  try {
    const text = `${paper.title} ${paper.summary}`;
    const embedding = await embedText(text);

    const response = await fetch(
      `https://${PINECONE_INDEX}-${PINECONE_ENV}.svc.pinecone.io/vectors/upsert`,
      {
        method: 'POST',
        headers: {
          'Api-Key': PINECONE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vectors: [{
            id: paper.id,
            values: embedding,
            metadata: {
              title: paper.title,
              summary: paper.summary,
              authors: paper.authors.join(', '),
              published: paper.published,
              categories: paper.categories.join(', '),
              pdfUrl: paper.pdfUrl,
            },
          }],
          namespace: 'papers',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pinecone upsert error: ${response.status}`);
    }

    console.log(`[Pinecone] ✓ Stored paper: ${paper.id}`);
    return true;
  } catch (error) {
    console.error(`[Pinecone] Error storing paper: ${error}`);
    return false;
  }
}

export async function searchSimilar(query: string, topK = 5): Promise<PaperEmbedding[]> {
  if (!PINECONE_API_KEY) {
    console.warn('[Pinecone] API key not set');
    return [];
  }

  try {
    const queryEmbedding = await embedText(query);

    const response = await fetch(
      `https://${PINECONE_INDEX}-${PINECONE_ENV}.svc.pinecone.io/query`,
      {
        method: 'POST',
        headers: {
          'Api-Key': PINECONE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: queryEmbedding,
          topK,
          namespace: 'papers',
          includeMetadata: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pinecone query error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.matches || []).map((match: any) => ({
      id: match.id,
      title: match.metadata?.title || '',
      summary: match.metadata?.summary || '',
      authors: match.metadata?.authors?.split(', ') || [],
      published: match.metadata?.published || '',
      categories: match.metadata?.categories?.split(', ') || [],
      score: match.score,
    }));
  } catch (error) {
    console.error(`[Pinecone] Search error: ${error}`);
    return [];
  }
}

export async function initializePinecone(): Promise<boolean> {
  if (!PINECONE_API_KEY) {
    console.warn('[Pinecone] API key not configured - using local storage only');
    return false;
  }

  try {
    // Check if index exists
    const response = await fetch(
      `https://${PINECONE_INDEX}-${PINECONE_ENV}.svc.pinecone.io/describe_index`,
      {
        headers: {
          'Api-Key': PINECONE_API_KEY,
        },
      }
    );

    if (response.ok) {
      console.log('[Pinecone] ✓ Connected to index');
      return true;
    } else if (response.status === 404) {
      console.warn('[Pinecone] Index not found - create it in Pinecone dashboard');
      return false;
    } else {
      throw new Error(`Pinecone describe error: ${response.status}`);
    }
  } catch (error) {
    console.error(`[Pinecone] Init error: ${error}`);
    return false;
  }
}

// Delete all papers (for testing)
export async function clearAllPapers(): Promise<boolean> {
  if (!PINECONE_API_KEY) return false;

  try {
    const response = await fetch(
      `https://${PINECONE_INDEX}-${PINECONE_ENV}.svc.pinecone.io/vectors/delete`,
      {
        method: 'POST',
        headers: {
          'Api-Key': PINECONE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteAll: true,
          namespace: 'papers',
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error(`[Pinecone] Clear error: ${error}`);
    return false;
  }
}
