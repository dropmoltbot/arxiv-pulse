# Deployment

## Vercel (Recommended)

### Automatic Deploys

Connect your GitHub repository to Vercel:
1. Go to https://vercel.com/new
2. Import `dropmoltbot/arxiv-pulse`
3. Add environment variables:
   - `MINIMAX_API_KEY` - Your MiniMax API key
   - `PINECONE_API_KEY` - (optional) Pinecone API key

### Manual Deploy

```bash
npm run build
vercel --prod
```

---

## Cron Job Setup

The app fetches ArXiv papers automatically every 6 hours.

### Option 1: Vercel Cron (Recommended)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Option 2: External Cron

Use a service like Cron-Job.org or GitHub Actions:

```yaml
# .github/workflows/cron.yml
name: ArXiv Fetch
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch papers
        run: curl -x POST https://arxiv-pulse-seven.vercel.app/api/papers
```

### Option 3: Local Cron (on your server)

```bash
# Run every 6 hours
crontab -e

# Add this line:
# 0 */6 * * * curl -x POST https://arxiv-pulse-seven.vercel.app/api/papers
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | Yes | MiniMax API key for summarization |
| `PINECONE_API_KEY` | No | Pinecone API key for vector storage |
| `OLLAMA_URL` | No | Local Ollama URL (fallback) |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/papers` | GET | Fetch latest papers |
| `/api/cron` | POST | Cron endpoint (for scheduled jobs) |
