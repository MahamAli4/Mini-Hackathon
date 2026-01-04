# Quick Fix: API Key Issue

## Problem
Aapne jo key di hai wo **Publishable Key** hai:
```
sb_publishable_ZnZB7VuIDg9eKeZyZN-x-A_IhMkQ6AH
```

Ye key **authentication ke liye kaam nahi karti**. Isliye login/signup fail ho raha hai.

## Solution: Correct Key Kaise Milegi

### Step 1: Supabase Dashboard
1. [Supabase Dashboard](https://supabase.com/dashboard) par login karein
2. Apna project (`MahamAli4's Project`) select karein

### Step 2: API Settings
1. Left sidebar mein **Settings** (⚙️ icon) par click karein
2. **API** option select karein

### Step 3: Copy Correct Key
Screenshot mein dikhaya gaya hai - aapko **2 keys** dikhegi:

**Project URL:**
```
https://inobbejethxftzrplmcs.supabase.co
```
✅ Ye sahi hai

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2JiZWpldGh4ZnR6cnBsbWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTQ0NDgsImV4cCI6MjA1MzEzMDQ0OH0...
```
❌ **Ye wali key chahiye** (ye example hai, aapki key alag hogi)

### Step 4: Mujhe Key Dein
Jab aap correct **anon public key** copy kar lein (jo `eyJ` se shuru hoti hai), to mujhe dein. Main code update kar doonga.

---

## Temporary Workaround (Testing Ke Liye)
Agar aap abhi test karna chahti hain bina key ke:
1. Supabase Dashboard > Authentication > Settings
2. **"Confirm email"** option ko **DISABLE** kar dein
3. **"Enable email provider"** option ko **ENABLE** kar dein

Phir bhi correct anon key ki zaroorat hogi.
