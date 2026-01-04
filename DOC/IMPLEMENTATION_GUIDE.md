# Implementation Guide: Post Application Challenge

This guide explains how to build a professional, responsive Post Application using **HTML**, **CSS**, **Bootstrap**, **JavaScript**, and **Supabase**.

## 1. Project Architecture & Setup

### Tech Stack
- **HTML5 & CSS3**: For structure and custom styling.
- **Bootstrap 5**: For responsive layout, components (cards, navbar, modals), and forms.
- **JavaScript (ES6+)**: For application logic and Supabase integration.
- **Supabase**: Backend for Database, Authentication, and Image Storage.

### Recommended Folder Structure
```text
/mini-hackathon
├── index.html          (The Feed/Home Page)
├── login.html          (Login Page)
├── signup.html         (Signup Page)
├── css/
│   └── style.css       (Custom CSS for premium look)
├── js/
│   ├── auth.js         (Authentication logic)
│   ├── app.js          (Post fetching & display)
│   └── crud.js         (Create, Edit, Delete logic)
└── assets/             (Local images/icons)
```

---

## 2. Setting Up Supabase

You need to create a project on [Supabase](https://supabase.com/).

### Database Table: `posts`
Create a table named `posts` with these columns:
- `id`: int8 (Primary Key, Auto-increment)
- `created_at`: timestamptz (Default: now())
- `title`: text
- `content`: text
- `image_url`: text (URL from Supabase Storage)
- `author_id`: uuid (Foreign Key to `auth.users`)
- `author_name`: text

### Storage Bucket: `post-images`
Create a **Public** bucket named `post-images` to store uploaded blog photos.

---

## 3. Frontend Implementation

### Using Bootstrap for Responsive UI
Use Bootstrap's Grid system (`container`, `row`, `col`) to ensure the app works on mobile and desktop.

#### Premium UI Tips:
- **Navigation**: Use a fixed-top `navbar`.
- **Cards**: Use Bootstrap `card` components for blog posts with shadow effects (`shadow-sm`).
- **Modals**: Use Bootstrap `modal` for the "Create New Post" form.

### External Libraries (CDNs)
Add these to your HTML files:
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Supabase JS Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

## 4. JavaScript Logic (The "Brain" of the App)

### Initialization
Create a global Supabase client in your JS:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
```

### Key Functions to Implement:
1. **SignUp/Login**: Use `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`.
2. **Fetch Posts**: Use `supabase.from('posts').select('*').order('created_at', { ascending: false })`.
3. **Upload Image**: Use `supabase.storage.from('post-images').upload()`.
4. **Create Post**: After image upload, get the public URL and save the post data to the `posts` table.

---

## 5. Step-by-Step Development Plan

1. **Step 1: Auth Pages** - Design `signup.html` and `login.html`. Lock the `index.html` so only logged-in users can see it.
2. **Step 2: Database** - Create the `posts` table and add some test data manually in Supabase dashboard.
3. **Step 3: Feed Page** - Write JS to fetch posts and dynamically create HTML cards in `index.html`.
4. **Step 4: Create/Upload** - Implement the Modal form and image upload logic.
5. **Step 5: Edit/Delete** - Add buttons to posts (only visible to the author) to handle updates and removals.

---
> [!TIP]
> To make it look "Professional", use a Google Font like **Inter** or **Roboto** and use a consistent color palette (e.g., Deep Navy and White).
