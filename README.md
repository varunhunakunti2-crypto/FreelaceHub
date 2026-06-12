# Freelance Agency Management Platform

A Next.js 14 freelance marketplace platform with Supabase authentication, project management, proposals, messaging, and admin dashboards.

## Local Setup

1. Clone the repository

```bash
git clone https://github.com/your-org/freelance-agency-management-platform.git
cd freelance-agency-management-platform
```

2. Install dependencies

```bash
npm install
```

3. Create your environment file

```bash
cp .env.local.example .env.local
```

4. Configure Supabase

- Create a new Supabase project
- Copy the project URL and public anon key from the Supabase dashboard
- Copy the service role key from the API settings
- Paste those values into `.env.local`

5. Apply database schema

- Use the SQL provided in `DATABASE_SCHEMA.md` to create tables and indexes in your Supabase project.
- If you use Supabase CLI, you can also apply a SQL migration from the dashboard or your own migration setup.

6. Run the app locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deployment

This repository includes `vercel.json` for Vercel deployment.

1. Connect your GitHub repository to Vercel.
2. Set the following environment variables in your Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy the app.

## Environment Variables

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key for client auth
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for server-side / admin operations

## Notes

- Dark mode is supported in the UI.
- Error handling is enabled globally with a custom error boundary and app-level error page.
- Empty state screens are used across list pages.
- Loading skeletons are available for consistent asynchronous UI feedback.
