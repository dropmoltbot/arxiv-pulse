#!/usr/bin/env node
// Cron job: Fetch ArXiv papers every 6 hours
// Run: node scripts/cron-fetch.js

const { fetchArxivPapers } = require('../src/lib/arxiv');
const { summarizePaper } = require('../src/lib/llm');
const { storePaper, initializePinecone } = require('../src/lib/pinecone');

const TOPICS = [
  'LLM reasoning',
  'agent systems', 
  'transformer architecture',
  'AI safety',
  'multimodal models',
];

async function fetchAndStore() {
  console.log(`[${new Date().toISOString()}] Starting ArXiv fetch...`);
  
  const allPapers = [];
  
  // Fetch papers for each topic
  for (const topic of TOPICS) {
    console.log(`Fetching: ${topic}`);
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
  
  console.log(`Found ${allPapers.length} unique papers`);
  
  // Initialize Pinecone
  const pineconeReady = await initializePinecone();
  
  // Summarize and store
  for (const paper of allPapers.slice(0, 10)) {
    console.log(`Summarizing: ${paper.id}`);
    const summary = await summarizePaper(paper);
    if (summary && pineconeReady) {
      await storePaper(paper);
    }
  }
  
  console.log(`[${new Date().toISOString()}] Done!`);
}

// Run if called directly
if (require.main === module) {
  fetchAndStore().catch(console.error);
}

module.exports = { fetchAndStore };
