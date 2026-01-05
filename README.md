# David + Daniel Shared Database ✨📚

A production-ready Notion-style collaborative database for David and Daniel to manage projects, tasks, and ideas together.

## Features

- 🧩 **Dynamic Columns**: Add, edit, reorder, and customize column types (text, number, select, multi-select, date, checkbox, URL)
- ➕ **Row Management**: Add, delete, duplicate rows with ease
- 🔄 **Inline Editing**: Click any cell to edit, Enter to save, Esc to cancel
- 🔍 **Search & Filter**: Powerful search across all columns and filter by column values
- 📱 **Responsive Design**: Beautiful table view on desktop, card view on mobile
- 💾 **Persistent Storage**: SQLite database - no external database setup required!
- ✨ **Polish**: Smooth animations, toast notifications, confetti on column creation, loading states
- 🎨 **Beautiful UI**: Colorful gradient header, emojis throughout, accessible design

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: TailwindCSS
- **Database**: SQLite (file-based, no external database needed)
- **ORM**: Prisma
- **Validation**: Zod
- **UI Components**: React with server actions
- **Notifications**: react-hot-toast
- **Confetti**: canvas-confetti

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
# Generate Prisma Client and create database
npx prisma generate
npx prisma db push

# Seed with default data
npm run db:seed
```

That's it! No environment variables, no external databases, no setup required! 🎉

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

- **SQLite Database**: All data is stored in a local `dev.db` file in the `prisma` folder
- **Zero Configuration**: No environment variables needed - just install and run
- **Persistent**: Your data persists between app restarts
- **Portable**: The database file can be easily backed up or shared

## Database Location

The SQLite database is stored at: `prisma/dev.db`

You can:
- **Backup**: Simply copy the `dev.db` file
- **Reset**: Delete `dev.db` and run `npx prisma db push` and `npm run db:seed` again
- **Inspect**: Use `npm run db:studio` to view/edit data visually

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push Prisma schema to database (create/update tables)
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed database with default data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Deployment

### Local Production Build

```bash
npm run build
npm start
```

### Vercel Deployment (Optional)

**Note**: SQLite works great locally but has limitations on serverless platforms like Vercel. For production deployment, you may want to:

1. Switch to PostgreSQL (see original setup) for serverless compatibility
2. Or use a different hosting platform that supports file-based databases

If deploying to Vercel, you'll need to:
1. Set up a PostgreSQL database (Supabase, Neon, etc.)
2. Change the datasource in `prisma/schema.prisma` to PostgreSQL
3. Set `DATABASE_URL` environment variable

## Troubleshooting

### Database File Not Found

```bash
npx prisma db push
```

### Reset Database

```bash
# Delete the database file
rm prisma/dev.db

# Recreate it
npx prisma db push
npm run db:seed
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

## Data Persistence

✅ **Data persists locally** - All data is stored in `prisma/dev.db`. As long as you don't delete this file, your data is safe.

⚠️ **Important**: 
- Back up `prisma/dev.db` regularly
- Don't commit `*.db` files to git (they're in `.gitignore`)
- If sharing the database, copy the `dev.db` file

## License

Private project for David and Daniel.

## Support

For issues or questions, check the troubleshooting section above or review the codebase comments.

---

Built with ❤️ by David and Daniel
