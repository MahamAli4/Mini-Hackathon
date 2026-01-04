# Database & Storage Fix Guide

To fix the publishing issue and enable Edit/Delete functionality, please follow these steps:

## 1. Update Database Schema
Run this SQL in your Supabase **SQL Editor**:

```sql
-- Add missing columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read posts
CREATE POLICY "Allow public read access"
ON public.posts FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own posts
CREATE POLICY "Allow individual insert"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can update their own posts
CREATE POLICY "Allow individual update"
ON public.posts FOR UPDATE
USING (auth.uid() = author_id);

-- Policy: Authors can delete their own posts
CREATE POLICY "Allow individual delete"
ON public.posts FOR DELETE
USING (auth.uid() = author_id);
```

## 2. Fix Storage Bucket Policies
Ensure your bucket name is `post-image`. Then run this SQL:

```sql
-- Storage Policies for 'post-image' bucket
INSERT INTO storage.policies (name, id, bucket_id, definition, action)
VALUES 
  ('Public Access', 'public_read', 'post-image', '{"perm": "read"}', 'SELECT'),
  ('Authenticated Upload', 'authenticated_upload', 'post-image', '{"perm": "write"}', 'INSERT');
```
*Note: If the above storage SQL fails, simply go to **Storage > post-image > Policies** and click **"New Policy"** to allow Public Read and Authenticated Insert.*

---

## 3. Code Fix
I have updated `app.js` to match your bucket name (`post-image`). Please save the changes and try again!
