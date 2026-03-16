# Deployment Guide

## 🚀 Vercel (Recommended)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/arxiv-pulse)

1. **Create GitHub repo:**
```bash
cd arxiv-pulse
git init
git add .
git commit -m "Initial commit"
gh repo create arxiv-pulse --public
git push origin main
```

2. **Click the button above** → Connect your repo

3. **Add environment variables in Vercel dashboard:**
   - `MINIMAX_API_KEY` = your key

---

## ☁️ Cloudflare Pages

**Note:** Requires Next.js 14-15 (currently using 16)

To downgrade:
```bash
npm install next@15.5.2
npm install @cloudflare/next-on-pages
npx @cloudflare/next-on-pages
```

Then deploy via Cloudflare dashboard or:
```bash
npx @cloudflare/next-on-pages deploy
```

---

## 📋 Checklist Before Deploy

- [ ] Copy `.env.example` to `.env.local` and fill values
- [ ] Push to GitHub
- [ ] Add API keys in deployment dashboard
- [ ] Test locally: `npm run dev`
