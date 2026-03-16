# 🧠 Arxiv Pulse

<p align="center">
  <img src="https://img.shields.io/github/stars/dropmoltbot/arxiv-pulse" alt="Stars">
  <img src="https://img.shields.io/github/license/dropmoltbot/arxiv-pulse" alt="License">
  <img src="https://img.shields.io/github/last-commit/dropmoltbot/arxiv-pulse" alt="Last Commit">
  <img src="https://img.shields.io/github/deployments/dropmoltbot/arxiv-pulse/production" alt="Deployments">
</p>

<p align="center">
  <a href="https://arxiv-pulse.vercel.app">
    <img src="https://vercel.com/button" alt="Deploy to Vercel">
  </a>
  <a href="https://arxiv-pulse.pages.dev">
    <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare">
  </a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Query ArXiv papers by topic, author, or keyword |
| 🤖 **AI Summarization** | LLM-powered paper summaries using MiniMax or Ollama |
| 🎯 **Topic Tracking** | Monitor specific research areas |
| 📊 **Vector Storage** | Save & search papers with Pinecone embeddings |
| 📱 **Telegram Alerts** | Get instant notifications for relevant papers |
| ✨ **Smooth Animations** | Built with Motion.dev for premium UX |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  ArXiv API      │────▶│  LLM (MiniMax)   │────▶│  Pinecone       │
│  (papers fetch) │     │  (summarization) │     │  (vector store) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  Telegram Bot   │
                        │  (alerts)       │
                        └─────────────────┘
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/dropmoltbot/arxiv-pulse.git
cd arxiv-pulse
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `MINIMAX_API_KEY` | API key from [MiniMax](https://platform.minimax.chat) | ✅ |
| `PINECONE_API_KEY` | API key from [Pinecone](https://pinecone.io) | ❌ |
| `OLLAMA_URL` | Local Ollama URL (fallback) | ❌ |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ❌ |

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dropmoltbot/arxiv-pulse)

1. Click the button above
2. Connect your GitHub
3. Add `MINIMAX_API_KEY` in env vars
4. Deploy! 🚀

### Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect `dropmoltbot/arxiv-pulse`
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add env vars
5. Deploy!

---

## 📁 Project Structure

```
arxiv-pulse/
├── src/
│   ├── app/
│   │   ├── page.tsx       # Main dashboard
│   │   └── globals.css    # Global styles
│   └── lib/
│       ├── arxiv.ts       # ArXiv API client
│       ├── llm.ts         # LLM (MiniMax/Ollama)
│       └── pinecone.ts    # Vector store
├── scripts/
│   ├── deploy-vercel.sh
│   └── deploy-cloudflare.sh
├── public/                # Static assets
├── SPEC.md               # Technical specification
├── DEPLOY.md             # Deployment guide
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Motion.dev |
| **LLM** | MiniMax API + Ollama (fallback) |
| **Vector DB** | Pinecone |
| **Hosting** | Vercel / Cloudflare Pages |

---

## 🔧 Customization

### Add New Topics

Edit `src/app/page.tsx`:

```typescript
const DEFAULT_TOPICS = [
  'LLM reasoning',
  'agent systems',
  'transformer architecture',
  'AI safety',
  'multimodal models',
  'YOUR_NEW_TOPIC',  // Add here
];
```

### Add New LLM Provider

Edit `src/lib/llm.ts` to add Anthropic, OpenAI, etc.

---

## 📄 License

MIT License — See [LICENSE](LICENSE)

---

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/dropmoltbot">dropmoltbot</a>
</p>
