'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { formatDate } from '@/lib/arxiv';

interface PaperWithSummary {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  categories: string[];
  pdfUrl: string;
  summaryData?: {
    summary: string;
    keyInsights: string[];
    relevanceScore: number;
  };
}

// Generate random 3D SVG avatar
function BotAvatar() {
  const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'];
  const [color] = useState(() => colors[Math.floor(Math.random() * colors.length)]);
  
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Robot body */}
      <rect x="8" y="12" width="32" height="28" rx="4" fill={`url(#grad-${color.replace('#', '')})`} />
      {/* Robot head */}
      <rect x="12" y="4" width="24" height="12" rx="3" fill={color} />
      {/* Eyes */}
      <circle cx="18" cy="10" r="3" fill="#0a0a0a" />
      <circle cx="30" cy="10" r="3" fill="#0a0a0a" />
      {/* Antenna */}
      <line x1="24" y1="4" x2="24" y2="0" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="0" r="2" fill={color} />
      {/* Glow effect */}
      <circle cx="24" cy="26" r="12" fill={color} fillOpacity="0.2" />
    </motion.svg>
  );
}

// Search Bar Component
function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.form
      ref={ref}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ delay: 0.5 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <div className="relative">
        <motion.input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search papers by topic, author, or keyword..."
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.6 }}
          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#00d4ff] text-black font-semibold rounded-full hover:bg-[#00d4ff]/90 transition-colors"
        >
          Search
        </motion.button>
      </div>
    </motion.form>
  );
}

// Loading skeleton
function PaperSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
      <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
      <div className="h-4 bg-white/10 rounded w-full" />
    </div>
  );
}

// Paper Card with animation
function PaperCard({ paper, index }: { paper: PaperWithSummary; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="group bg-white/[0.02] border border-white/5 hover:border-[#00d4ff]/30 rounded-lg p-5 transition-all duration-300 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
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
          
          <h2 className="text-lg font-semibold leading-tight mb-2 group-hover:text-[#00d4ff] transition-colors">
            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
              {paper.title}
            </a>
          </h2>
          
          <p className="text-sm text-white/50 mb-3 truncate">
            {paper.authors.slice(0, 4).join(', ')}
            {paper.authors.length > 4 && ` +${paper.authors.length - 4}`}
          </p>
          
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
            {paper.summary}
          </p>
          
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

// Header
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
          <div className="flex items-center gap-4">
            <BotAvatar />
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

// Topics
function Topics({ topics, onSelect }: { topics: string[]; onSelect: (topic: string) => void }) {
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
            <motion.button
              key={topic}
              onClick={() => onSelect(topic)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ scale: 1.05, borderColor: "rgba(0, 212, 255, 0.3)" }}
              className="px-3 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-white/70 cursor-pointer transition-colors"
            >
              {topic}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main page
export default function Home() {
  const [papers, setPapers] = useState<PaperWithSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const DEFAULT_TOPICS = [
    'LLM reasoning',
    'agent systems',
    'transformer architecture',
    'AI safety',
    'multimodal models',
  ];

  const loadPapers = async (query?: string) => {
    setLoading(true);
    try {
      const url = query 
        ? `/api/search?q=${encodeURIComponent(query)}`
        : '/api/papers';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.papers) {
        setPapers(data.papers);
      } else if (data.results) {
        setPapers(data.results);
      }
    } catch (error) {
      console.error('Error loading papers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadPapers(query);
  };

  const handleTopicSelect = (topic: string) => {
    handleSearch(topic);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header paperCount={papers.length} />
      <SearchBar onSearch={handleSearch} />
      <Topics topics={DEFAULT_TOPICS} onSelect={handleTopicSelect} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid gap-4">
            {[1,2,3,4,5].map(i => <PaperSkeleton key={i} />)}
          </div>
        ) : papers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/50">No papers found</p>
            <p className="text-white/30 text-sm mt-2">Try a different search term</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {papers.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index} />
            ))}
          </div>
        )}
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
