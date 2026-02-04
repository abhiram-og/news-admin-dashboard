# Deployment Guide

## Prerequisites

- Node.js 18+
- Backend API running

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your backend URL
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Build & Deploy

### Option 1: Static Hosting (Recommended)

```bash
# Install dependencies
npm ci

# Build
npm run build

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - GitHub Pages
# - Any static host
```

### Option 2: Docker

```bash
# Build image
docker build -t news-admin:latest .

# Run container
docker run -d -p 80:80 news-admin:latest
```

### Option 3: Nginx Server

```bash
# Build
npm run build

# Copy to server
scp -r dist/* user@server:/var/www/news-admin/

# Nginx config
server {
    listen 80;
    root /var/www/news-admin;
    try_files $uri $uri/ /index.html;
}
```

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://your-bucket/
```

## Security Checklist

- [ ] Use HTTPS for API
- [ ] Set CORS on backend
- [ ] Store tokens securely
- [ ] Enable rate limiting
- [ ] Use environment variables

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on refresh | Check nginx try_files config |
| API not connecting | Verify VITE_API_BASE_URL |
| CORS errors | Configure backend CORS |
| Blank page | Check browser console for errors |
