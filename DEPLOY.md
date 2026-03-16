# Deploy to Vercel

```bash
cd arxiv-pulse
./scripts/deploy-vercel.sh
```

Or manually:
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

# Deploy to Cloudflare Pages

```bash
cd arxiv-pulse
./scripts/deploy-cloudflare.sh
```

Or manually:
```bash
npm i -g wrangler
wrangler login
wrangler pages project create arxiv-pulse
wrangler pages deploy .next
```

---

# Already Deployed?

If you've already deployed manually, add your URLs here:

## Vercel
**URL:** https://arxiv-pulse.vercel.app

## Cloudflare  
**URL:** https://arxiv-pulse.pages.dev
