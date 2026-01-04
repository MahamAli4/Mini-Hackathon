# 🚀 Step-by-Step Guide: Fixing Your Database (SQL Editor)

Don't worry! Being a beginner is part of the journey. The reason your posts aren't publishing is that the code is trying to save "Author" information, but your database table doesn't have those columns yet.

Follow these simple steps to fix it:

### Step 1: Open SQL Editor
1.  Go to your **Supabase Dashboard**.
2.  On the left sidebar, look for the **SQL Editor** icon (it looks like a `>_` terminal symbol).
3.  Click on **"+ New query"** (usually a big green button or a plus icon).

### Step 2: Paste the Code
Copy the entire block of code below and paste it into the SQL Editor window:

```sql
-- 1. Add missing columns to 'posts' table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- 2. Enable Row Level Security (RLS)
-- This makes your database secure!
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Let everyone SEE the posts
CREATE POLICY "Allow public read access"
ON public.posts FOR SELECT
USING (true);

-- 4. Policy: Let logged-in users CREATE their own posts
CREATE POLICY "Allow individual insert"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- 5. Policy: Let authors EDIT their own posts
CREATE POLICY "Allow individual update"
ON public.posts FOR UPDATE
USING (auth.uid() = author_id);

-- 6. Policy: Let authors DELETE their own posts
CREATE POLICY "Allow individual delete"
ON public.posts FOR DELETE
USING (auth.uid() = author_id);
```

### Step 3: Run the Query
1.  After pasting the code, click the **"Run"** button (usually at the bottom right of the editor).
2.  You should see a message saying **"Success. No rows returned"** or similar.

---

### Step 4: Final Check (Auth Settings)
One last thing! Make sure your settings allow you to signup/login:
1.  Go to **Authentication > Sign In / Providers**.
2.  Click on **Email**.
3.  Ensure **"Allow new users to sign up"** is **ON** (Green).
4.  Ensure **"Confirm email"** is **OFF** (Grey).
5.  **EXTREMELY IMPORTANT**: Click the **"Save changes"** button at the bottom of that page.

---

### Step 5: Test Your App!
1.  Refresh your `index.html` page in the browser.
2.  Try to Create a Post.
3.  It should now work perfectly! 🎉

> [!TIP]
> If you see an error in the browser, press **F12**, click on **Console**, and tell me what the red text says. I'm here to help!
