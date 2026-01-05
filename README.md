# David + Daniel Shared Database ✨📚

A production-ready Notion-style collaborative database for David and Daniel to manage projects, tasks, and ideas together.

## Features

- 🧩 **Dynamic Columns**: Add, edit, reorder, and customize column types (text, number, select, multi-select, date, checkbox, URL)
- ➕ **Row Management**: Add, delete, duplicate rows with ease
- 🔄 **Inline Editing**: Click any cell to edit, Enter to save, Esc to cancel
- 🔍 **Search & Filter**: Powerful search across all columns and filter by column values
- 📱 **Responsive Design**: Beautiful table view on desktop, card view on mobile
- 💾 **Persistent Storage**: PostgreSQL database via Prisma ORM - data persists through redeploys
- ✨ **Polish**: Smooth animations, toast notifications, confetti on column creation, loading states
- 🎨 **Beautiful UI**: Colorful gradient header, emojis throughout, accessible design

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL (Supabase or Neon recommended)
- **ORM**: Prisma
- **Validation**: Zod
- **UI Components**: React with server actions
- **Notifications**: react-hot-toast
- **Confetti**: canvas-confetti

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A PostgreSQL database (free tiers available on [Supabase](https://supabase.com) or [Neon](https://neon.tech))
- (Optional) Supabase account for magic link authentication

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Database Setup

#### Option A: Using Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (it should look like: `postgresql://user:password@host/dbname`)
4. Add it to your `.env` file as `DATABASE_URL`

#### Option B: Using Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string under "Connection string" > "URI"
5. Add it to your `.env` file as `DATABASE_URL`

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname"

# Optional: Supabase Auth (if using magic link authentication)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Optional: Email allowlist for Supabase Auth
ALLOWED_EMAILS="david@example.com,daniel@example.com"

# Optional: Fallback shared passcode (if not using Supabase Auth)
SHARED_PASSCODE="your-secret-passcode"
```

**Note**: If you don't set up Supabase Auth or a passcode, the app will allow access in development mode (not recommended for production).

### 4. Database Migration and Seeding

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (or use migrate for production)
npx prisma db push

# Seed the database with default columns and rows
npm run db:seed
```

The seed script will create:
- 10 default columns (Item, Owner, Status, Priority, Due Date, Next Step, Notes, Tags, Link, Done?)
- 3 starter rows with sample data

**Important**: The seed script only runs if no columns exist, so it's safe to run multiple times.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - (Optional) `NEXT_PUBLIC_SUPABASE_URL`
   - (Optional) `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Optional) `ALLOWED_EMAILS`
   - (Optional) `SHARED_PASSCODE`

### 3. Configure Build Settings

Vercel should auto-detect Next.js, but ensure:
- Build Command: `npm run build` (or `prisma generate && next build`)
- Output Directory: `.next`

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Run Migrations in Production

After first deployment, you may need to run migrations:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Via Supabase/Neon dashboard SQL editor
# Copy the SQL from prisma/migrations folder and run it
```

### 6. Seed Production Database

If you need to seed the production database:

```bash
# Set production DATABASE_URL in your local .env
npx prisma db push
npm run db:seed
```

Or use Prisma Studio to manually seed:

```bash
npx prisma studio
```

## Database Schema

### Columns Table
- `id`: Unique identifier
- `name`: Column name
- `type`: Column type (text, number, select, multi_select, date, checkbox, url)
- `orderIndex`: Display order
- `settingsJson`: Type-specific settings (e.g., select options)
- `createdAt`, `updatedAt`: Timestamps

### Rows Table
- `id`: Unique identifier
- `orderIndex`: Display order
- `createdAt`, `updatedAt`: Timestamps

### Cells Table
- `id`: Unique identifier
- `rowId`: Foreign key to row
- `columnId`: Foreign key to column
- `valueJson`: Cell value stored as JSON
- `updatedAt`: Timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed database with default data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from your IP (some free tiers restrict connections)
- For Neon: Ensure your connection pooling mode is set correctly
- For Supabase: Use the connection pooler URL if available

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Migration Issues

If you get migration errors, try:

```bash
npx prisma migrate reset  # WARNING: This deletes all data!
npx prisma migrate dev
```

Or use `db push` for development:

```bash
npx prisma db push
```

### Seed Script Not Running

The seed script only runs if no columns exist. To re-seed:

1. Manually delete columns via Prisma Studio: `npx prisma studio`
2. Or truncate tables via SQL:
   ```sql
   TRUNCATE TABLE "cells" CASCADE;
   TRUNCATE TABLE "rows" CASCADE;
   TRUNCATE TABLE "columns" CASCADE;
   ```

### Build Errors on Vercel

- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that Prisma is generating correctly: add `prisma generate` to build command
- Verify all dependencies are in `package.json`

### Authentication Issues

- If using Supabase Auth, ensure URLs and keys are correct
- If using passcode, ensure `SHARED_PASSCODE` is set
- Check browser console for auth errors

## Data Persistence

✅ **Data persists through redeploys** - All data is stored in your PostgreSQL database. As long as your database connection string remains the same, your data will be safe.

⚠️ **Important**: Never commit your `.env` file or database credentials to version control!

## License

Private project for David and Daniel.

## Support

For issues or questions, check the troubleshooting section above or review the codebase comments.

---

Built with ❤️ by David and Daniel

