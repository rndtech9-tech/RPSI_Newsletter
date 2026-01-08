
# Supabase Final Setup

Follow these steps to ensure your Vercel deployment works with real-time updates.

## 1. Database Initialization
Run this exact script in your Supabase SQL Editor:

```sql
-- Reset the table structure
DROP TABLE IF EXISTS newsletter_content;

CREATE TABLE newsletter_content (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the single row that the app updates
INSERT INTO newsletter_content (data) 
VALUES ('{"sections": []}'); 

-- Enable Realtime
ALTER TABLE newsletter_content REPLICA IDENTITY FULL;
```

## 2. Enable Realtime in the UI
1. Go to **Database** in the Supabase sidebar.
2. Go to **Replication**.
3. Under the `supabase_realtime` publication, click **Edit Tables**.
4. Check the box for `newsletter_content` and save.

## 3. Vercel Environment Variables
In your Vercel Project Dashboard (Settings > Environment Variables), add these:
- `VITE_SUPABASE_URL`: (Found in Supabase Project Settings > API)
- `VITE_SUPABASE_ANON_KEY`: (Found in Supabase Project Settings > API)
- `VITE_ADMIN_PASSWORD`: (Your secret password for the admin panel)

## 4. Deployment
Push your changes to GitHub. Vercel will automatically rebuild the app. Once it finishes, your admin panel will save to the cloud, and guests will see updates instantly.
