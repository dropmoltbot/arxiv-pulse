// ArXiv API Client
export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  updated: string;
  pdfUrl: string;
  categories: string[];
  comment?: string;
}

export async function fetchArxivPapers(query: string, maxResults = 10): Promise<ArxivPaper[]> {
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  
  const response = await fetch(url);
  const xml = await response.text();
  
  const papers: ArxivPaper[] = [];
  const entries = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);
  
  for (const match of entries) {
    const entry = match[1];
    
    const idMatch = entry.match(/<id>(.*?)<\/id>/);
    const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
    const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/s);
    const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
    const updatedMatch = entry.match(/<updated>(.*?)<\/updated>/);
    const pdfMatch = entry.match(/<link title="pdf" href="(.*?)"/);
    const commentMatch = entry.match(/<arxiv:comment>(.*?)<\/arxiv:comment>/);
    
    const authorMatches = entry.matchAll(/<author><name>(.*?)<\/name><\/author>/g);
    const authors = Array.from(authorMatches, m => m[1]);
    
    const categoryMatches = entry.matchAll(/<category term="(.*?)"/g);
    const categories = Array.from(categoryMatches, m => m[1]);
    
    if (idMatch && titleMatch && summaryMatch) {
      papers.push({
        id: idMatch[1].replace('http://arxiv.org/abs/', ''),
        title: titleMatch[1].replace(/\s+/g, ' ').trim(),
        summary: summaryMatch[1].replace(/\s+/g, ' ').trim(),
        authors,
        published: publishedMatch?.[1] || '',
        updated: updatedMatch?.[1] || '',
        pdfUrl: pdfMatch?.[1] || '',
        categories,
        comment: commentMatch?.[1],
      });
    }
  }
  
  return papers;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
