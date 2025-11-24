# Deployment Guide: Backend to Render + Frontend to Netlify

## Overview
- **Backend API**: Deploy to Render.com (free tier)
- **Frontend**: Already on Netlify, we'll update it with new API URL
- **Database**: MongoDB Atlas (already configured)

---

## Step 1: Prepare Your Code for Deployment

### A. Create `.env.example` for documentation (Render will need this)
The file already exists at root, but let's make sure it's correct:

```env
MONGODB_URI=mongodb+srv://debasishbehera488_db_user:Debasish@cluster0.xqdgiyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=skillpath
PORT=5000
ADMIN_KEY=your-secret-admin-key-here
VITE_API_URL=http://localhost:5000
VITE_ADMIN_KEY=
```

### B. Make sure `server/index.js` reads PORT from .env
✅ Already done — it uses `process.env.PORT || 4000`

### C. Update `.gitignore` (if not already done)
Make sure `.env` is in `.gitignore` so secrets aren't committed:
```
.env
node_modules/
dist/
```

---

## Step 2: Push Code to GitHub

Run these commands in PowerShell:

```powershell
cd 'D:\skillpath\skillpath-connect-main'

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Add backend API and registration sync fixes"

# Add your GitHub repo as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repo name.

---

## Step 3: Deploy Backend to Render

1. **Go to** https://render.com and **sign up/login** (use GitHub to login for easier setup)

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository
   - Choose the repo containing this project

3. **Configure the Web Service:**
   - **Name**: `skillpath-api` (or any name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free (should work fine)

4. **Add Environment Variables:**
   - Click "Environment" section
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://debasishbehera488_db_user:Debasish@cluster0.xqdgiyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     MONGODB_DB = skillpath
     PORT = 10000
     ADMIN_KEY = change-me
     ```
   - **Note**: Render assigns a PORT automatically, we'll use 10000 as fallback

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment to complete
   - Once live, you'll get a URL like: `https://skillpath-api-xyz.onrender.com`
   - **Copy this URL** — you'll need it next

6. **Test the backend:**
   - Visit `https://skillpath-api-xyz.onrender.com/api/health` in your browser
   - You should see: `{"dbConnected":true,"usingMongo":true}`

---

## Step 4: Update Frontend Config

Update your `.env.example` and environment config for Netlify:

### A. Update local `.env` file:
```env
MONGODB_URI=mongodb+srv://debasishbehera488_db_user:Debasish@cluster0.xqdgiyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=skillpath
PORT=5000
ADMIN_KEY=change-me
VITE_API_URL=https://skillpath-api-xyz.onrender.com
VITE_ADMIN_KEY=
```

Replace `skillpath-api-xyz.onrender.com` with your actual Render URL.

### B. Update Netlify Environment Variables:

1. **Go to** https://app.netlify.com
2. **Select your site** (skillpathindia)
3. **Go to** Site Settings → Environment
4. **Add variable:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://skillpath-api-xyz.onrender.com` (your Render URL)
5. **Save and trigger a redeploy**

---

## Step 5: Redeploy Frontend to Netlify

**Option A: Automatic (Recommended)**
- Push changes to GitHub
- Netlify will auto-redeploy

**Option B: Manual**
1. Go to Netlify dashboard
2. Select your site
3. Click "Trigger deploy" → "Deploy site"

Wait 1-2 minutes for deployment.

---

## Step 6: Test Everything

### Test 1: Local Dev (Your Laptop)
```powershell
cd 'D:\skillpath\skillpath-connect-main'

# Terminal 1 - Backend
$env:Path = "C:\Program Files\nodejs;$env:Path"
npm run start:api

# Terminal 2 - Frontend
npm run dev
```

Visit http://localhost:8081/register → register a student → check admin dashboard at http://localhost:8081/admin/login
✅ Should show the registration

### Test 2: Live Website
1. **Open** https://skillpathindia.netlify.app/register (on any device)
2. **Register a student**
3. **Open admin dashboard** on same or different device: https://skillpathindia.netlify.app/admin/login
4. **Login with:**
   - Email: `debasish8384747@gmail.com`
   - Password: `DEBS@8249`
5. ✅ **Should see the registration!**

### Test 3: Cross-Device Sync
1. **Device 1**: Visit live website, register
2. **Device 2**: Check admin dashboard
3. ✅ **Should see Device 1's registration**

---

## Troubleshooting

### "Connection refused" or "Cannot reach API"
- Check Render deployment is live (green status)
- Verify VITE_API_URL is correct in Netlify
- Wait a few minutes after redeploy for cache to clear

### "MongoDB disconnected"
- Check MONGODB_URI in Render environment variables
- Verify MongoDB Atlas IP whitelist allows Render (usually auto)

### Registrations still not appearing
- Open Browser DevTools (F12)
- Check Console for errors
- Check Network tab → POST to `/api/registrations`
- Paste the error here and I'll fix it

---

## Done! 🎉

Your system is now:
- ✅ Frontend on Netlify (live)
- ✅ Backend on Render (live API)
- ✅ MongoDB on Atlas (live database)
- ✅ All registrations sync across devices
