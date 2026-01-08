
# Supabase Final Setup (Fixed)

Follow these steps to ensure your Vercel deployment works with real-time updates.

## 1. Database Initialization
Run this exact script in your Supabase **SQL Editor**:

```sql
-- Reset the table structure
DROP TABLE IF EXISTS newsletter_content;

-- Create table allowing manual ID (required for the app's upsert logic)
CREATE TABLE newsletter_content (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMPORTANT: Disable RLS for this table so the public API key can save data
-- (Alternatively, you can create an "INSERT/UPDATE" policy for the 'anon' role)
ALTER TABLE newsletter_content DISABLE ROW LEVEL SECURITY;

-- Insert the single row that the app updates (Must be ID 1)
INSERT INTO newsletter_content (id, data) 
VALUES (1, '{"sections": []}'); 

-- Enable Realtime
ALTER TABLE newsletter_content REPLICA IDENTITY FULL;
```

## 2. Enable Realtime in the UI
1. Go to **Database** in the Supabase sidebar.
2. Go to **Replication**.
3. Under the `supabase_realtime` publication, click **Edit Tables**.
4. Check the box for `newsletter_content` and save.

## 3. Vercel Environment Variables
Ensure these are in Vercel Settings > Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`
