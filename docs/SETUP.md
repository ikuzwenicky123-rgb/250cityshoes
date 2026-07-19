# City Shoes Store - Setup Guide

## Prerequisites
- Node.js 16+
- PostgreSQL
- Git

## Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials

# Start server
npm run dev
```

Backend will be available at `http://localhost:5000`

## Database Setup

```bash
psql -U postgres
CREATE DATABASE cityshoes_db;
```

## Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend (Railway)
1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy

## Free Domain
Use Vercel's free domain or register at freenom.com