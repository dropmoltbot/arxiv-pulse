import { NextResponse } from 'next/server';
import { fetchArxivPapers, ArxivPaper } from '@/lib/arxiv';
import { summarizePaper } from '@/lib/llm';
import { storePaper, initializePinecone } from '@/lib/pinecone';

export const dynamic = 'force-dynamic';

const TOPICS = [
  'LLM reasoning',
  'agent systems',
  'transformer architecture',
  'AI safety',
  'multimodal models',
];

export async function GET() {
  try {
    const allPapers: ArxivPaper[] = [];
    
    // Fetch papers for each topic
    for (const topic of TOPICS) {
      const papers = await fetchArxivPapers(topic, 5);
      for (const paper of papers) {
        if (!allPapers.find(p => p.id === paper.id)) {
          allPapers.push(paper);
        }
      }
    }
    
    // Sort by date
    allPapers.sort((a, b) => 
      new Date(b.published).getTime() - new Date(a.published).getTime()
    );
    
    // Initialize Pinecone
    await initializePinecone();
    
    // Get summaries for top papers
    const papersWithSummaries = await Promise.all(
      allPapers.slice(0, 10).map(async (paper) => {
        const summary = await summarizePaper(paper);
        if (summary) {
          await storePaper(paper);
        }
        return {
          ...paper,
          summaryData: summary,
        };
      })
    );
    
    return NextResponse.json({
      papers: papersWithSummaries,
      count: papersWithSummaries.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}
