# CalendarProject - Supabase & GitHub Pages Setup Guide

## Overview
This project uses:
- **Frontend**: GitHub Pages (static hosting)
- **Backend**: Supabase (database + authentication)
- **Database**: PostgreSQL with Row Level Security

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### 1.2 Create a New Project
1. Click "New Project"
2. Fill in:
   - **Name**: CalendarProject (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### 1.3 Get Your API Credentials
1. In your Supabase dashboard, click "Settings" (gear icon)
2. Click "API" in the sidebar
3. Copy these two values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

### 1.4 Set Up the Database
1. Click "SQL Editor" in the sidebar
2. Click "New query"
3. Open `supabase-schema.sql` from your project
4. Copy ALL the SQL code
5. Paste into the Supabase SQL editor
6. Click "Run" (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

This creates:
- `homework` table with columns: id, user_id, class, title, due_date, type, notes, completed
- `tasks` table with columns: id, user_id, title, date, completed
- `events` table with columns: id, user_id, title, day, month, time
- Row Level Security policies (users can only see their own data)

## Step 2: Configure Your App

### 2.1 Update Supabase Config
1. Open `docs/assets/js/supabase-config.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co'; // Paste your Project URL here
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Paste your anon public key here
```

**Important**: Make sure to keep the quotes around the values!

### 2.2 Update Dashboard Script Reference
1. Open `docs/pages/dashboard.html`
2. Find the script tags at the bottom (around line 308)
3. Change this line:
   ```html
   <script src="../assets/js/dashboard.js"></script>
   ```
   To:
   ```html
   <script src="../assets/js/dashboard-supabase.js"></script>
   ```

## Step 3: Test Locally

### 3.1 Run a Local Server
You need to run a local server because Supabase requires a proper origin. You can't just open index.html directly.

**Option A: Using Python (easiest)**
```bash
cd /Users/mklinchik27/Desktop/CalendarProject/docs
python3 -m http.server 8000
```

**Option B: Using Node.js**
```bash
cd /Users/mklinchik27/Desktop/CalendarProject/docs
npx serve
```

**Option C: Using VS Code Live Server**
1. Install "Live Server" extension
2. Right-click on `docs/index.html`
3. Select "Open with Live Server"

### 3.2 Test the Application
1. Open browser to `http://localhost:8000` (or the port shown)
2. Create a new account (sign up)
3. Verify you receive a confirmation email
4. Confirm your email (check spam folder)
5. Sign in with your new account
6. Try adding homework, tasks, and events
7. Try toggling between class view and list view
8. Sign out and sign back in to verify data persists

## Step 4: Deploy to GitHub Pages

### 4.1 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `calendar-project` (or any name)
4. Choose **Public** or **Private**
5. Don't initialize with README
6. Click "Create repository"

### 4.2 Push Your Code
Open Terminal in your project folder:

```bash
cd /Users/mklinchik27/Desktop/CalendarProject

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with Supabase integration"

# Add remote (replace USERNAME and REPO with yours)
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4.3 Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the sidebar
4. Under "Source":
   - Branch: `main`
   - Folder: `/docs`
5. Click "Save"
6. Wait 1-2 minutes
7. Your site will be live at: `https://USERNAME.github.io/REPO/`

### 4.4 Update Supabase URL Settings
1. Go back to Supabase dashboard
2. Click "Authentication" → "URL Configuration"
3. Add your GitHub Pages URL to "Site URL":
   ```
   https://USERNAME.github.io/REPO/
   ```
4. Add to "Redirect URLs":
   ```
   https://USERNAME.github.io/REPO/
   https://USERNAME.github.io/REPO/pages/dashboard.html
   ```

## Step 5: Verify Everything Works

### 5.1 Test on GitHub Pages
1. Visit your GitHub Pages URL
2. Sign up for a new account
3. Confirm email
4. Sign in
5. Add homework/tasks/events
6. Test all features:
   - ✓ Class view shows homework by class
   - ✓ List view shows homework by date
   - ✓ Modal opens when clicking "+ Add Homework"
   - ✓ Homework saves and appears immediately
   - ✓ Checkboxes mark homework as complete
   - ✓ Logout works and redirects to login

## Troubleshooting

### "Failed to fetch" or CORS errors
- Make sure you're using a local server (not opening files directly)
- Verify your GitHub Pages URL is added to Supabase redirect URLs
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct

### Email confirmation not working
- Check spam folder
- In Supabase: Authentication → Email Templates → Check settings
- For development: Disable email confirmation in Authentication → Providers → Email

### Homework not loading
- Open browser console (F12) and check for errors
- Verify SQL schema ran successfully in Supabase
- Check that you're signed in (check user ID in console)

### Blank page or JavaScript errors
- Make sure you updated the script reference to `dashboard-supabase.js`
- Check browser console for specific error messages
- Verify all files are in the `docs/` folder

## Optional Enhancements

### Disable Email Confirmation (Development Only)
1. Supabase Dashboard → Authentication → Providers
2. Click "Email"
3. Toggle OFF "Confirm email"
4. Save

### Add Real-time Updates
Dashboard automatically updates when data changes without page refresh. To enable:
1. Uncomment real-time code in `dashboard-supabase.js` (if provided)
2. Or add subscription listeners for live updates

### Custom Email Templates
1. Supabase → Authentication → Email Templates
2. Customize confirmation and password reset emails
3. Add your app name and branding

## Security Notes

- ✓ Row Level Security (RLS) is enabled - users can only see their own data
- ✓ API keys are safe to expose (anon key is meant to be public)
- ✓ Never commit sensitive keys (if you use service_role key in future)
- ✓ All authentication is handled by Supabase securely

## What's Next?

- Add delete functionality for homework
- Add edit functionality
- Implement tasks and events with Supabase (currently still using localStorage)
- Add due date reminders/notifications
- Add calendar view
- Export homework to PDF or CSV

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs: Dashboard → Logs
3. Verify your SQL schema was applied correctly
4. Make sure email is confirmed

Happy tracking! 📚✨
