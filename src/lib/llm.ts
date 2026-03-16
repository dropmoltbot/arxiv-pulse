// LLM Client - MiniMax + Ollama Local
import { ArxivPaper } from './arxiv';

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = 'https://api.minimax.chat/v1';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export interface LLMResponse {
  summary: string;
  keyInsights: string[];
  relevanceScore: number;
}

export async function summarizePaper(paper: ArxivPaper): Promise<LLMResponse | null> {
  const prompt = `You are a research assistant. Analyze this ArXiv paper and provide:
1. A 2-sentence summary
2. 3-4 key insights
3. A relevance score (0-100) for someone interested in AI/LLMs

Paper:
Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Abstract: ${paper.summary}

Respond in JSON format:
{
  "summary": "...",
  "keyInsights": ["...", "..."],
  "relevanceScore": number
}`;

  // Try MiniMax first
  if (MINIMAX_API_KEY) {
    try {
      const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MINIMAX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'MiniMax-M2.5',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return JSON.parse(content) as LLMResponse;
        }
      }
    } catch (error) {
      console.error('MiniMax error:', error);
    }
  }

  // Fallback to Ollama local
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.response;
      if (content) {
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as LLMResponse;
        }
      }
    }
  } catch (error) {
    console.error('Ollama error:', error);
  }

  // Return mock if no LLM available
  return {
    summary: paper.summary.slice(0, 150) + '...',
    keyInsights: ['LLM not configured - showing abstract preview'],
    relevanceScore: 50,
  };
}

export async function batchSummarize(papers: ArxivPaper[]): Promise<Map<string, LLMResponse>> {
  const results = new Map<string, LLMResponse>();
  
  const batchSize = 2;
  for (let i = 0; i < papers.length; i += batchSize) {
    const batch = papers.slice(i, i + batchSize);
    const promises = batch.map(async (paper) => {
      const summary = await summarizePaper(paper);
      if (summary) {
        results.set(paper.id, summary);
      }
    });
    await Promise.all(promises);
    if (i + batchSize < papers.length) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  return results;
}
