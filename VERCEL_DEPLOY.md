# Vercel Deployment Guide

## Quick Deploy to Vercel

Your code is now on GitHub at: https://github.com/draphael123/daniel-david-projects.git

### Step 1: Deploy via Vercel Dashboard

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find and select the `daniel-david-projects` repository
   - Click "Import"

3. **Configure Project Settings**
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL = your-postgresql-connection-string
   ```

   Optional (for authentication):
   ```
   NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
   ALLOWED_EMAILS = david@example.com,daniel@example.com
   ```

   Or use a shared passcode:
   ```
   SHARED_PASSCODE = your-secret-passcode
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

### Step 2: Initialize Database After First Deployment

After your first deployment, you need to set up the database:

**Option A: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

5. Run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

6. Seed the database:
   ```bash
   npm run db:seed
   ```

**Option B: Using Supabase/Neon SQL Editor**

1. Go to your database dashboard (Supabase or Neon)
2. Open the SQL Editor
3. Copy the contents of `prisma/schema.prisma`
4. Manually create tables using Prisma migrations SQL
5. Run the seed script locally with production `DATABASE_URL`

### Step 3: Verify Deployment

1. Visit your Vercel deployment URL (shown after deployment)
2. Check that you see "DB connected ✅" in the header
3. If you see "DB disconnected ⚠️", verify your `DATABASE_URL` is correct

### Troubleshooting

**Build Fails:**
- Check that `DATABASE_URL` is set in Vercel environment variables
- Ensure Prisma generates correctly (check build logs)
- Verify Node.js version compatibility (Vercel uses Node 18+ by default)

**Database Connection Issues:**
- Verify your database allows connections from Vercel IPs
- For Neon: Use the connection pooler URL
- For Supabase: Ensure connection pooling is enabled
- Check database credentials are correct

**Migration Issues:**
- Run `npx prisma migrate deploy` locally with production `DATABASE_URL`
- Or use `npx prisma db push` for development (not recommended for production)

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Optional | Supabase anonymous key |
| `ALLOWED_EMAILS` | ⚠️ Optional | Comma-separated email list |
| `SHARED_PASSCODE` | ⚠️ Optional | Shared passcode for access |

### Next Steps

- Set up custom domain (optional) in Vercel project settings
- Configure environment variables for different environments (Production, Preview, Development)
- Set up automatic deployments from GitHub (enabled by default)
- Monitor deployments and logs in Vercel dashboard

---

Your app will be live at: `https://your-project-name.vercel.app`

🎉 Congratulations! Your shared database is now live!

