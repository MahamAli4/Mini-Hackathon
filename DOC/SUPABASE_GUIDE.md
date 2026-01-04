# Supabase Integration Guide: Post Application

Ab hum apne frontend ko **Supabase** backend se connect karenge. Isse hamari application real-world data save kar sakegi, images upload karegi, aur user login handle karegi.

---

## 1. Supabase Project Setup
Sabse pehle [Supabase Dashboard](https://supabase.com/dashboard/) par jayein aur ek naya project create karein.

### A. Database Table (`posts`)
Database mein ek table banayein jise hum posts kehte hain.
- **SQL Editor** mein ye command run karein:
```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  content text not null,
  image_url text, -- Is mein hum image ka link save karenge
  author_id uuid references auth.users not null, -- User ki unique ID
  author_name text
);

-- Enable Row Level Security (RLS) for security
alter table posts enable row level security;

-- Policies (Allow everyone to read, only authors to modify)
create policy "Public posts are viewable by everyone." on posts for select using (true);
create policy "Users can insert their own posts." on posts for insert with check (auth.uid() = author_id);
```

### B. Storage Bucket (`post-images`)
Posts ki images save karne ke liye hume ek bucket chahiye.
1. Supabase Dashboard mein **Storage** par jayein.
2. **New Bucket** par click karein aur naam `post-images` rakhein.
3. Is bucket ko **Public** kar dein taake images frontend par dikh sakein.

---

## 2. Connecting Frontend to Supabase

Har HTML file mein Supabase ki library already added hai. Ab hume **Environment Variables** (URL aur Key) chahiye.

### A. Initialization
`js/app.js` aur `js/auth.js` ke top par ye code aayega:
```javascript
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
```

### B. Logic Breakdown (Frontend Connection)

#### 1. Authentication (`js/auth.js`)
Signup aur Login ke liye ye functions use honge:
```javascript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' } // User ka naam metadata mein
  }
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'password123'
});
```

#### 2. Fetching Posts (`js/app.js`)
Home page par data dikhane ke liye:
```javascript
async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (data) {
    // Is data ko loop kar ke cards banayein (Main feed page pe)
  }
}
```

#### 3. Creating a Post with Image Upload
Sabse pehle image upload hogi, phir uska URL database mein jayega:
```javascript
async function createPost(file, title, content) {
  // 1. Upload Image to Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(`public/${Date.now()}-${file.name}`, file);

  if (uploadData) {
    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(uploadData.path);

    // 3. Save Post to Database
    const { error: insertError } = await supabase.from('posts').insert([{
      title: title,
      content: content,
      image_url: urlData.publicUrl,
      author_id: (await supabase.auth.getUser()).data.user.id
    }]);
  }
}
```

---

## 3. Immediate Next Steps
1. [ ] **Supabase Key Layout**: Apna `URL` aur `Key` tayyar rakhein.
2. [ ] **Auth Logic**: Pehle Login/Signup ko fix karte hain taake hume user ki ID mil sake. 
3. [ ] **CRUD**: Phir posts ko save aur display karne par kaam karenge.

> [!IMPORTANT]
> Kya aapke paas Supabase Project ki **URL** aur **Anon Key** maujood hai? Agar haan, to mujhe dein taake main apke code mein insert kar sakoon.
