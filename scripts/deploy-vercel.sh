#!/bin/bash
# Deploy to Vercel

echo "🚀 Deploying to Vercel..."

# Install Vercel CLI if needed
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy
vercel --prod
