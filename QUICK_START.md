# 🚀 Quick Start - CalendarProject with Supabase

## 📋 What You Need To Do

### 1️⃣ Set Up Supabase (5 minutes)
```
1. Go to supabase.com → Sign up
2. Create new project → Wait 2-3 min
3. Settings → API → Copy:
   - Project URL
   - anon public key
```

### 2️⃣ Run the Database Schema (1 minute)
```
1. Supabase Dashboard → SQL Editor
2. Open supabase-schema.sql from your project
3. Copy all SQL code → Paste → Run
4. Should see "Success. No rows returned"
```

### 3️⃣ Add Your Credentials (1 minute)
```
1. Open: docs/assets/js/supabase-config.js
2. Replace:
   const SUPABASE_URL = 'YOUR-PROJECT-URL-HERE'
   const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY-HERE'
3. Save file
```

### 4️⃣ Test Locally (2 minutes)
```bash
cd /Users/mklinchik27/Desktop/CalendarProject/docs
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

### 5️⃣ Deploy to GitHub Pages (5 minutes)
```bash
cd /Users/mklinchik27/Desktop/CalendarProject
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then on GitHub:
```
Settings → Pages → Source: main branch, /docs folder → Save
```

### 6️⃣ Update Supabase URLs (1 minute)
```
Supabase → Authentication → URL Configuration
Add your GitHub Pages URL to:
- Site URL
- Redirect URLs
```

## ✅ Files You Have Now

### Core Files:
- `docs/index.html` - Login/signup page
- `docs/pages/dashboard.html` - Main app
- `docs/assets/js/auth.js` - Authentication (Supabase ready ✓)
- `docs/assets/js/dashboard-supabase.js` - Dashboard logic (Supabase integrated ✓)
- `docs/assets/js/supabase-config.js` - Config file (needs your credentials)

### Setup Files:
- `supabase-schema.sql` - Database tables & security
- `SETUP_GUIDE.md` - Detailed instructions
- `QUICK_START.md` - This file

## 🎯 What Works Now

With Supabase integration:
- ✅ User signup/signin with email confirmation
- ✅ Secure authentication (password hashing)
- ✅ Each user only sees their own data
- ✅ Homework stored in PostgreSQL database
- ✅ Class view (7 subject cards)
- ✅ List view (sorted by date)
- ✅ Add homework modal
- ✅ Mark homework complete
- ✅ Data persists across sessions
- ✅ Works on any device

## 🔑 Important Notes

**Security:**
- anon key is safe to expose (it's public)
- Row Level Security protects user data
- Each user can only access their own records

**Email Confirmation:**
- By default, users must confirm email
- Check spam folder
- To disable: Supabase → Auth → Providers → Email → Toggle off "Confirm email"

**Local Testing:**
- Must use a server (can't open HTML directly)
- Use Python, Node.js, or VS Code Live Server

## 🐛 Common Issues

**"Failed to fetch"**
→ Check SUPABASE_URL and SUPABASE_ANON_KEY are correct

**Blank page**
→ Open console (F12), check for errors

**Homework not loading**
→ Verify SQL schema ran successfully

**Can't sign up**
→ Check email confirmation settings

## 📞 Next Steps

Once everything works:
1. Customize the 7 classes (edit CLASSES array in dashboard-supabase.js)
2. Add delete homework functionality
3. Migrate tasks and events to Supabase
4. Customize colors and theme
5. Add more features!

---

**Need help?** Check SETUP_GUIDE.md for detailed troubleshooting.
