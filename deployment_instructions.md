
# Supabase Deployment Instructions

To scale this application from LocalStorage to a live cloud database:

## 1. Setup Supabase Project
1. Go to [database.new](https://database.new) and create a new project.
2. In the **SQL Editor**, create a table named `newsletter_content`:
   ```sql
   create table newsletter_content (
     id uuid primary key default uuid_generate_v4(),
     data jsonb not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```
3. Enable **Realtime** on the `newsletter_content` table to ensure Guest Portal updates instantly.

## 2. Connect the App
1. Replace the `useState` data initialization in `App.tsx` with a Supabase client fetch:
   ```ts
   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient('YOUR_URL', 'YOUR_KEY');

   // Inside App component:
   useEffect(() => {
     const channel = supabase
       .channel('schema-db-changes')
       .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'newsletter_content' }, payload => {
         setData(payload.new.data);
       })
       .subscribe();
     
     return () => { supabase.removeChannel(channel); };
   }, []);
   ```

## 3. Handle Admin Saves
Update the `onUpdate` function in `App.tsx` to push to Supabase:
```ts
const handleUpdate = async (newData: NewsletterData) => {
  const { error } = await supabase
    .from('newsletter_content')
    .update({ data: newData })
    .eq('id', 'YOUR_STATIC_ID'); // Usually just one row for the whole newsletter
  if (!error) setData(newData);
};
```

## 4. Hosting
- Deploy the frontend to **Vercel** or **Netlify**.
- Use Environment Variables for the Supabase Key and URL.
- Print a QR code pointing to the Vercel URL for guest access.
