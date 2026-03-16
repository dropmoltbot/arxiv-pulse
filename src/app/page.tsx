'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { fetchArxivPapers, ArxivPaper, formatDate } from '@/lib/arxiv';

interface PaperWithSummary extends ArxivPaper {
  summaryData?: {
    summary: string;
    keyInsights: string[];
    relevanceScore: number;
  };
}

// Client component for paper card with animation
function PaperCard({ paper, index }: { paper: PaperWithSummary; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group bg-white/[0.02] border border-white/5 hover:border-[#00d4ff]/30 rounded-lg p-5 transition-all duration-300 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-white/40 mb-2 font-mono">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.08 + 0.2 }}
            >
              {formatDate(paper.published)}
            </motion.span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="truncate">{paper.categories[0]}</span>
          </div>
          
          {/* Title */}
          <h2 className="text-lg font-semibold leading-tight mb-2 group-hover:text-[#00d4ff] transition-colors">
            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
              {paper.title}
            </a>
          </h2>
          
          {/* Authors */}
          <p className="text-sm text-white/50 mb-3 truncate">
            {paper.authors.slice(0, 4).join(', ')}
            {paper.authors.length > 4 && ` +${paper.authors.length - 4}`}
          </p>
          
          {/* Summary */}
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
            {paper.summary}
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-3">
            {paper.categories.slice(0, 3).map((cat, i) => (
              <motion.span
                key={cat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.08 + 0.3 + i * 0.05 }}
                className="px-2 py-0.5 text-[10px] font-mono bg-white/5 text-white/40 rounded"
              >
                {cat}
              </motion.span>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2">
          <motion.a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-[#00d4ff]/10 text-[#00d4ff] rounded hover:bg-[#00d4ff]/20 transition-colors text-xs font-mono text-center"
          >
            PDF
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/5 text-white/40 rounded hover:bg-white/10 transition-colors text-xs font-mono"
            title="Summarize with AI"
          >
            ✨
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// Header with staggered animation
function Header({ paperCount }: { paperCount: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold tracking-tight"
            >
              <span className="text-[#00d4ff]">Arxiv</span>Pulse
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-sm mt-1"
            >
              AI-powered research discovery
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-white/40 font-mono"
            >
              {paperCount} papers
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="w-2 h-2 bg-[#00d4ff] rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// Topics with stagger
function Topics({ topics }: { topics: string[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.3 }}
      className="border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, i) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ scale: 1.05, borderColor: "rgba(0, 212, 255, 0.3)" }}
              className="px-3 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-white/70 cursor-pointer transition-colors"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main page
export default function Home() {
  const [papers, setPapers] = useState<PaperWithSummary[]>([]);

  useEffect(() => {
    async function loadPapers() {
      const DEFAULT_TOPICS = [
        'LLM reasoning',
        'agent systems',
        'transformer architecture',
        'AI safety',
        'multimodal models',
      ];
      
      const allPapers: PaperWithSummary[] = [];
      
      for (const topic of DEFAULT_TOPICS) {
        const result = await fetchArxivPapers(topic, 3);
        for (const paper of result) {
          if (!allPapers.find(p => p.id === paper.id)) {
            allPapers.push(paper);
          }
        }
      }
      
      allPapers.sort((a, b) => 
        new Date(b.published).getTime() - new Date(a.published).getTime()
      );
      
      setPapers(allPapers.slice(0, 15));
    }
    
    loadPapers();
  }, []);

  const DEFAULT_TOPICS = [
    'LLM reasoning',
    'agent systems',
    'transformer architecture',
    'AI safety',
    'multimodal models',
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header paperCount={papers.length} />
      <Topics topics={DEFAULT_TOPICS} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {papers.map((paper, index) => (
            <PaperCard key={paper.id} paper={paper} index={index} />
          ))}
        </div>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-white/10 mt-12"
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-xs text-white/30 font-mono">
            Arxiv Pulse • Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
