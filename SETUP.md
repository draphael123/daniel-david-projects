# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Choose one:

#### Option A: Neon (Easiest)
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
4. Add to `.env` file:
   ```env
   DATABASE_URL="your-connection-string-here"
   ```

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Add to `.env` file:
   ```env
   DATABASE_URL="your-connection-string-here"
   ```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Optional: For authentication
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
ALLOWED_EMAILS="david@example.com,daniel@example.com"

# OR use a simple passcode:
SHARED_PASSCODE="your-secret-passcode"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Seed with default columns and rows
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

After first deployment, run migrations:

```bash
# Set production DATABASE_URL locally
npx prisma migrate deploy
npm run db:seed
```

## Troubleshooting

**Can't connect to database?**
- Check your connection string is correct
- Ensure your database allows connections from your IP
- For Neon: Make sure you're using the connection pooler if available

**Seed script not working?**
- Make sure you ran `npx prisma db push` first
- Check the database connection
- Seed only runs if no columns exist (safe to run multiple times)

**Build errors on Vercel?**
- Add `DATABASE_URL` to Vercel environment variables
- Ensure build command includes `prisma generate`
- Check Vercel logs for specific errors

## Next Steps

- Customize the default columns and seed data in `prisma/seed.ts`
- Add authentication if needed
- Customize colors and styling in Tailwind config
- Add more column types or features as needed

