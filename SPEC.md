# Arxiv Pulse - Research Dashboard

## Project Overview
- **Name:** Arxiv Pulse
- **Type:** Web Dashboard (Next.js)
- **Core Functionality:** Automated ArXiv paper discovery, AI summarization, and knowledge management
- **Target Users:** Researchers, developers, AI enthusiasts

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  ArXiv API      │────▶│  LLM (OpenRouter)│────▶│  Pinecone       │
│  (cron 6h)      │     │  (summarize)     │     │  (vector store) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  Telegram Alert │
                        │  (instant)      │
                        └─────────────────┘
```

## Features

1. **Paper Feed** - Real-time ArXiv papers by topic
2. **AI Summarization** - Extract key insights using LLM
3. **Search** - Query saved papers
4. **Topics Tracking** - Monitor specific keywords
5. **Telegram Alerts** - Instant notification for relevant papers

## Tech Stack
- Next.js 14 + TypeScript + Tailwind
- shadcn/ui components
- Motion.dev for animations
- OpenRouter API (LLM)
- Pinecone (vector DB - requires API key)
- Telegram Bot API

## Design
- **Tone:** Brutally Minimal / Scientific
- **Colors:** Dark theme, cyan accent (#00d4ff)
- **Typography:** JetBrains Mono + Instrument Sans
- **Motion:** Subtle reveals, staggered animations
