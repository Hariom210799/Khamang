# 🚀 Khamang Deployment Guide - Render.com

## Status: READY FOR DEPLOYMENT ✅

Your app is almost production-ready! Follow these steps to deploy the backend and go live on Google Play Store.

---

## STEP 1: Push Latest Code to GitHub

```bash
cd c:\Users\HP\Desktop\Khamang\khamang

git add .
git commit -m "feat: Prepare for production deployment on Render

- Added render.yaml for automated deployment
- Updated API_CONFIG with Render URL
- All screens ready to use API_CONFIG
- Ready for production release"

git push origin main
```

---

## STEP 2: Deploy Backend on Render.com (10 minutes)

### 2a. Create Render Account
1. Go to **https://render.com**
2. Sign up with GitHub (easiest)
3. Authorize GitHub access

### 2b. Deploy Your Backend
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Select your GitHub repo: **`Hariom210799/Khamang`**
4. Configure:
   - **Name:** `khamang-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server/server.js`
   - **Plan:** Free (or paid for better performance)

### 2c. Add Environment Variables
Click "Advanced" and add these:

| Key | Value |
|-----|-------|
| `DATABASE` | `mongodb+srv://Har_2107:Hariom_210799@cluster0.m7py0pc.mongodb.net/khamangdb?appName=Cluster0` |
| `JWT_SECRET` | `khamang_jwt_secret_key_2024` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `SENDGRID_API_KEY` | Your SendGrid API key |
| `CLOUDINARY_CLOUD_NAME` | `dziah8jmx` |
| `CLOUDINARY_API_KEY` | `654922828333553` |
| `CLOUDINARY_API_SECRET` | `lC0HT3iR0_Fksey8vdUE5pLHwbg` |

5. Click **"Create Web Service"**

### 2d. Wait for Deployment
- Render will automatically pull your code
- Build will take 3-5 minutes
- You'll see "Live" when done

### 2e. Get Your Production URL
Once deployed, copy your URL (looks like):
```
https://khamang-api.onrender.com
```

This is your **PRODUCTION SERVER URL** ✅

---

## STEP 3: Update App with Production URL

Once you have your Render URL, update the config file:

**File:** `src/config/api.js`

Change this line:
```javascript
const PRODUCTION_API_URL = 'https://khamang-api.onrender.com';
```

To your actual Render URL (e.g., `https://your-unique-name.onrender.com`)

---

## STEP 4: Run Update Script (Auto-updates all screens)

```bash
# This script automatically updates all remaining screens to use API_CONFIG
python3 update_api_urls.py
```

Or manually if Python not available - see `API_UPDATE_GUIDE.md`

---

## STEP 5: Rebuild App for Production

```bash
cd android
cmd /c gradlew.bat bundleRelease
```

Your new AAB will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## STEP 6: Final Checks Before Uploading to Play Store

✅ Checklist:
- [ ] Backend deployed on Render (status: Live)
- [ ] Render URL is in `src/config/api.js`
- [ ] All screens updated with `API_CONFIG` import
- [ ] Built new AAB with updated config
- [ ] Tested login on Android phone (not emulator)
- [ ] Backend responds from production URL

Test on real phone:
```bash
npx react-native run-android
# Or install APK directly on phone
```

---

## STEP 7: Upload New AAB to Google Play

1. Go to **Google Play Console**
2. Go to **Release → Production**
3. Click **"Create new release"**
4. Upload new `app-release.aab`
5. Add release notes:
   ```
   Fixed: Production server integration
   - App now connects to live backend
   - Works on all devices and locations
   - Improved reliability and performance
   ```
6. Review and **Submit for review**

---

## WHAT HAPPENS NOW

### For Users Downloading Your App:
✅ App connects to **your production server on Render**
✅ All features work (login, orders, menu, etc.)
✅ Works from anywhere in the world
✅ Database stays secure on MongoDB Atlas
✅ No connection errors!

### For Developers (You):
✅ Can continue local development (uses emulator URL)
✅ Can test on real phone with production backend
✅ Can monitor server logs on Render dashboard

---

## TROUBLESHOOTING

### If app can't connect after deployment:

1. **Check Render is running:**
   - Go to Render dashboard
   - Verify service status is "Live"

2. **Check API_CONFIG has correct URL:**
   ```bash
   grep "PRODUCTION_API_URL" src/config/api.js
   ```

3. **Check backend responds:**
   ```bash
   curl https://your-render-url.onrender.com/api/v1/makers
   ```
   Should return JSON (not error)

4. **Check network on phone:**
   - Phone on WiFi or cellular
   - Can access `https://render.com` (test connectivity)

---

## IMPORTANT NOTES

⚠️ **Render Free Tier Limitations:**
- Spins down after 15 mins of inactivity
- First request takes 30 seconds
- For production, upgrade to paid tier ($7/month)

**To upgrade:**
1. Go to Render dashboard
2. Select your service
3. Settings → Change Plan to "Starter"

---

## SUMMARY

| Step | What | Time |
|------|------|------|
| 1 | Push to GitHub | 1 min |
| 2 | Deploy on Render | 5 min |
| 3 | Update app config | 1 min |
| 4 | Run update script | 1 min |
| 5 | Build new AAB | 5 min |
| 6 | Test on phone | 5 min |
| 7 | Upload to Play Store | 2 min |
| **Total** | | **20 min** |

Then wait 24-48 hours for Google Play approval! 🎉

---

**Questions?** Check render.yaml, API_UPDATE_GUIDE.md, or src/config/api.js for more details.

**Ready to go live?** Let's do this! 🚀
