# Deployment Guide

This guide covers deploying the AI Chatbot application to production environments.

## Table of Contents
1. [Frontend Deployment](#frontend-deployment)
2. [Backend Deployment](#backend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [CI/CD Pipeline](#cicd-pipeline)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Benefits:**
- Zero-config deployment
- Free tier available
- Git integration
- Automatic SSL
- Global CDN

**Steps:**

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select `frontend` folder as root

3. **Configure Environment Variables**
   - Add `VITE_API_URL` = `your-backend-url.com`

4. **Deploy**
   - Vercel automatically deploys on every git push

### Option 2: Netlify

**Steps:**

1. **Build locally**
```bash
cd frontend
npm run build
```

2. **Connect to Netlify**
   - Connect your GitHub account at [netlify.com](https://netlify.com)
   - Select repository
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/dist`

3. **Environment Variables**
   - Go to Build & deploy → Environment
   - Add `VITE_API_URL=your-backend-url.com`

4. **Deploy**
   - Netlify redeploys on every push

### Option 3: AWS S3 + CloudFront

**Steps:**

1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 bucket**
   - Upload `dist` folder contents to S3
   - Enable static website hosting
   - Make bucket public

3. **CloudFront Distribution**
   - Create distribution pointing to S3 bucket
   - Set default root object to `index.html`
   - Configure error routing to `index.html`

4. **Custom Domain**
   - Use Route 53 to manage DNS

---

## Backend Deployment

### Option 1: Render

**Benefits:**
- Easy Node.js deployment
- Free tier available
- Git integration
- Automatic SSL
- Environment variables in dashboard

**Steps:**

1. **Prepare backend**
   - Ensure `.env.production` exists
   - Update MONGO_URI for production database

2. **Create Render account**
   - Go to [render.com](https://render.com)
   - Create new Web Service

3. **Connect GitHub**
   - Select your repository
   - Branch: `main` (or your production branch)
   - Build command: `npm install`
   - Start command: `npm run start`

4. **Environment Variables**
   - In Render dashboard, add:
   ```
   PORT=8001
   JWT_SECRET=your_production_secret
   MONGO_URI=your_mongodb_uri
   OPENAI_API_KEY=your_key
   GROQ_API_KEY=your_key
   NODE_ENV=production
   ```

5. **Deploy**
   - Render auto-deploys on git push

### Option 2: Railway

**Steps:**

1. **Create Railway account**
   - Go to [railway.app](https://railway.app)

2. **New Project**
   - Create new project from GitHub
   - Select repository
   - Select `backend` folder

3. **Configure**
   - Start command: `npm run start`
   - Add environment variables in Railway dashboard

4. **Deploy**
   - Automatic deployment on git push

### Option 3: Heroku (Legacy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set PORT=8001 JWT_SECRET=secret MONGO_URI=uri

# Deploy
git push heroku main
```

### Option 4: Docker + AWS EC2/DigitalOcean

**Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/src ./src

EXPOSE 8001

CMD ["npm", "run", "start"]
```

**Build and push**
```bash
docker build -t chatbot-backend .
docker run -p 8001:8001 --env-file .env chatbot-backend
```

---

## Database Setup

### MongoDB Atlas Setup

1. **Create cluster**
   - Go to [mongodb.com/cloud](https://mongodb.com/cloud)
   - Create free M0 cluster
   - Choose region closest to users

2. **Create database user**
   - Security → Database Access
   - Create user with strong password
   - Note credentials

3. **Whitelist IP**
   - Security → Network Access
   - Add IP `0.0.0.0/0` (or specific IPs)

4. **Get connection string**
   - Clusters → Connect → Drivers
   - Copy URI: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Database Migrations

To prepare production database:

```bash
# Backend folder
node scripts/migrate-db.mjs  # If migration scripts exist
```

---

## Environment Variables

### Production Backend `.env`

```env
# Server
NODE_ENV=production
PORT=8001

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatbot-prod

# Authentication
JWT_SECRET=very_strong_secret_key_minimum_32_chars

# AI Services
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxx

# Optional: Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

### Production Frontend Environment

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=AI Chatbot
```

---

## SSL/TLS Certificates

### Automatic (Recommended)
- Vercel: Automatic
- Netlify: Automatic
- Render: Automatic
- Railway: Automatic

### Manual with Let's Encrypt
```bash
# Using Certbot
certbot certonly --standalone -d yourdomain.com
```

---

## Monitoring & Logging

### Backend Monitoring

**Install Sentry**
```bash
npm install @sentry/node
```

**Configure**
```javascript
import Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Logging

**Using Winston** (recommended)
```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install & Test Backend
      run: |
        cd backend
        npm install
        npm test
    
    - name: Build Frontend
      run: |
        cd frontend
        npm install
        npm run build
    
    - name: Deploy Frontend
      run: |
        # Vercel deployment command
        npm install -g vercel
        vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
    
    - name: Deploy Backend
      run: |
        # Render deployment (via git push)
        git push https://git.render.com/your-render-repo main
```

---

## Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze
```

### Backend
1. Enable gzip compression
2. Use connection pooling
3. Add database indexes
4. Cache responses where appropriate

---

## Backup Strategy

### MongoDB Backups
```bash
# Automatic backups in MongoDB Atlas
# Configure: Clusters → Backup
```

### Regular Backups
```bash
# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/chatbot"
```

---

## Scaling

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (Nginx, AWS ELB)
- MongoDB handles multiple connections

### Vertical Scaling
- Upgrade server size
- Increase database resources

---

## Troubleshooting

### Frontend not loading
- Check VITE_API_URL environment variable
- Verify backend is accessible
- Check browser console for errors

### API connection errors
- Verify backend is running
- Check CORS settings
- Verify API URL is correct
- Check firewall rules

### Database connection errors
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Verify credentials are correct

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] API endpoints respond
- [ ] Authentication works
- [ ] Can create projects
- [ ] Chat functionality works with AI backend
- [ ] Database is secure (backups enabled)
- [ ] SSL certificate is valid
- [ ] Monitoring/logging is configured
- [ ] Error tracking is enabled
- [ ] Performance is acceptable

---

**Last Updated**: January 2026
