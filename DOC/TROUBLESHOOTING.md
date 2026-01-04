# Troubleshooting Guide: Authentication Issues

## Problem Identified
Screenshot se pata chala ke signup karte waqt ye error aa raha hai:
```
Signup Error: Email address 'maham@gmail.com' is invalid
```

## Possible Causes & Solutions

### 1. **Email Confirmation Settings**
Supabase mein by default email confirmation enabled hota hai. Isko disable karna hoga testing ke liye.

**Fix:**
1. Supabase Dashboard > Authentication > Settings > Email Auth
2. **"Confirm email"** option ko **DISABLE** kar dein
3. Save karein

### 2. **Email Provider Configuration**
Agar aapne custom email provider setup nahi kiya, to Supabase apna default SMTP use karta hai jo kabhi kabhi issues deta hai.

**Fix:**
1. Testing ke liye **"Confirm email"** disable kar dein (upar wala step)
2. Ya phir Supabase ke email inbox mein check karein (Dashboard > Authentication > Users > Email Templates)

### 3. **API Key Issue**
Aapne jo key di hai wo `sb_publishable_` se shuru ho rahi hai. Ye **publishable key** hai, lekin hume **anon key** chahiye.

**Correct Key Location:**
1. Supabase Dashboard > Settings > API
2. **"anon"** key copy karein (ye `eyJ` se shuru hoti hai)
3. Ye key use karein

### 4. **URL Configuration**
URL sahi hai: `https://inobbejethxftzrplmcs.supabase.co`

---

## Immediate Action Required

Aapko Supabase Dashboard mein ja kar:
1. **Authentication > Settings** mein email confirmation **DISABLE** karein
2. **Settings > API** se correct **anon public key** copy karein (jo `eyJ` se shuru hoti hai)
3. Mujhe wo nai key dein taake main code update kar sakoon

---

## Testing Steps After Fix
1. Browser console open karein (F12)
2. Signup page par ja kar form fill karein
3. Console mein errors check karein
4. Network tab mein Supabase requests check karein
