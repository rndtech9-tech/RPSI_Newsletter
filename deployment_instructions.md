
# Rixos Premium Saadiyat - Seamless Deployment Guide

This guide ensures that your transition from local development to production is automated where possible and stable everywhere else.

## 1. Automated Build Process (GitHub -> Vercel)
The application is configured as a standard Vite/React project. When you push to your GitHub repository:
- **Dependency Resolution**: Vercel automatically detects `package.json` and runs `npm install`. This installs `@supabase/supabase-js` and React 19 dependencies automatically.
- **Production Build**: Vercel executes `npm run build`. The resulting `dist` folder is served via their global CDN.
- **Environment Passthrough**: The `getEnv` helper in `App.tsx` is designed to bridge Vite's `import.meta.env` and Vercel's environment injection, ensuring your Supabase connection strings are active immediately upon boot.

## 2. Supabase Connection Persistence
Since your Supabase project is already running:
- **No Impact on Existing Data**: Pushing new code does **not** reset your database. The `JSONB` architecture we used for the `newsletter_content` table is "schema-less," meaning if you add new sections in the Admin Portal, the database will simply store the new JSON structure without requiring SQL changes.
- **One-Time Manual Check**: 
  - Ensure the table `newsletter_content` exists (as per the SQL below).
  - **CRITICAL**: Go to your Supabase Dashboard -> **Realtime** -> **Manage** and ensure the `newsletter_content` table has **Write** replication enabled. This is the only way the Guest view "auto-refreshes" when the Admin saves changes.

## 3. SQL Initialization (If starting a new project)
If you ever move to a new Supabase project, run this single script:

```sql
-- Create the modular storage
CREATE TABLE IF NOT EXISTS newsletter_content (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime
ALTER TABLE newsletter_content REPLICA IDENTITY FULL;

-- Disable RLS for this specific internal tool
ALTER TABLE newsletter_content DISABLE ROW LEVEL SECURITY;

-- Seed initial data if table is empty
INSERT INTO newsletter_content (id, data)
SELECT 1, '{"sections": [], "footer": {"connectLabel": "CONNECT", "socialLinks": [], "copyrightText": "© 2025 RIXOS"}}'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_content WHERE id = 1);
```

## 4. Deployment Checklist
1. **GitHub Push**: Your code is synced.
2. **Vercel Dashboard**: Ensure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ADMIN_PASSWORD` are set in "Environment Variables".
3. **Public Assets**: Confirm `public/Diamond_white.png` is in the repository.
4. **SSL/HTTPS**: Vercel handles this automatically, which is required for Supabase Realtime (WSS) to function.

Your app is now optimized for a "Push to Deploy" workflow. No further manual intervention is needed for the database unless you wish to wipe it and start fresh.
