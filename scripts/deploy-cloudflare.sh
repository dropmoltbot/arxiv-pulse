#!/bin/bash
# Deploy to Cloudflare Pages

echo "☁️ Deploying to Cloudflare Pages..."

# Install Wrangler if needed
npm install -g wrangler

# Login (opens browser)
wrangler login

# Create Pages project
# wrangler pages project create arxiv-pulse

# Deploy
wrangler pages deploy .next
