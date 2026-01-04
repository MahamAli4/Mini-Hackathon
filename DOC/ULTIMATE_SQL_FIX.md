# 🚨 ULTIMATE SQL FIX: Resolving All Errors

If you are still seeing "row-level security policy" errors, it means the previous script didn't fully overwrite the old rules. Please run this **Aggressive Reset** script:

```sql
-- 1. Disable RLS temporarily to confirm it's not a table issue
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- 2. Add columns if they are still missing (Safe to run)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- 3. Delete ALL old policies to start from zero
DROP POLICY IF EXISTS "Allow public read access" ON public.posts;
DROP POLICY IF EXISTS "Allow individual insert" ON public.posts;
DROP POLICY IF EXISTS "Allow individual update" ON public.posts;
DROP POLICY IF EXISTS "Allow individual delete" ON public.posts;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.posts;

-- 4. Re-enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 5. CREATE NEW "EASY" POLICIES
-- Policy: Anyone (even not logged in) can READ
CREATE POLICY "Public Read" ON public.posts FOR SELECT USING (true);

-- Policy: ANY logged-in user can INSERT
CREATE POLICY "Authenticated Insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (true);

-- Policy: Authors can UPDATE their own
CREATE POLICY "Author Update" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);

-- Policy: Authors can DELETE their own
CREATE POLICY "Author Delete" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- 6. FIX STORAGE POLICIES (for image uploads)
-- Delete old storage policies for this bucket
DELETE FROM storage.policies WHERE bucket_id = 'post-image';

-- Allow anyone to see images
INSERT INTO storage.policies (name, id, bucket_id, definition, action)
VALUES ('Public Read', 'public_read_img', 'post-image', '{"perm": "read"}', 'SELECT');

-- Allow authenticated users to upload
INSERT INTO storage.policies (name, id, bucket_id, definition, action)
VALUES ('Auth Upload', 'auth_upload_img', 'post-image', '{"perm": "write"}', 'INSERT');
```

### ⚠️ IMPORTANT:
After clicking **Run**, make sure you see the green **"Success"** message. 

---

### How to Debug (If it still fails):
1.  Open your website.
2.  Press **F12** on your keyboard.
3.  Click on the **Console** tab.
4.  Try to Publish a post.
5.  Look for a log that says **"Post Data being sent"**.
6.  **Screenshot that log** and send it to me. It will tell me exactly what's going wrong!
