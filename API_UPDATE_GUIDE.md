# API Configuration Update Guide

## ✅ COMPLETED
- ✅ Created centralized API config: `src/config/api.js`
- ✅ Updated: `src/screens/login/index.js`
- ✅ Updated: `src/screens/signup/index.js`
- ✅ Updated: `src/screens/UserScreens/order/index.js`

## 🔄 REMAINING FILES TO UPDATE

All these files need to have:
1. Import added at top: `import API_CONFIG from '../relative/path/config/api';`
2. All hardcoded `http://10.0.2.2:3000` URLs replaced with `API_CONFIG.ENDPOINT_NAME`

### Files to update (by priority):

#### Priority 1 - Critical (Maker flow):
- [ ] `src/screens/MakerScreens/home/index.js` (6 API calls)
- [ ] `src/screens/MakerScreens/insights/index.js` (1 API call)
- [ ] `src/screens/MakerScreens/menu/index.js` (2 API calls)

#### Priority 2 - Important (Dish management):
- [ ] `src/screens/MakerScreens/menu/category-details/dishModal.js` (6 API calls)
- [ ] `src/screens/MakerScreens/menu/category-details/index.js` (3 API calls)

#### Priority 3 - User flows:
- [ ] `src/screens/UserScreens/order/place-order/index.js` (2 API calls)
- [ ] `src/screens/UserScreens/order/maker-details-screen/index.js` (1 API call)
- [ ] `src/screens/UserScreens/history/history-screen/product-list.component.tsx` (2 API calls)

#### Priority 4 - Settings:
- [ ] `src/screens/MakerScreens/settings/timeset-screen.js` (2 API calls)
- [ ] `src/screens/MakerScreens/settings/history-screen.js` (1 API call)

#### Priority 5 - Backend:
- [ ] `src/server/controllers/authController.js` (Update email verification link)

---

## Usage Pattern

### Before (Hardcoded):
```javascript
url: 'http://10.0.2.2:3000/api/v1/users/login'
```

### After (Using API_CONFIG):
```javascript
url: API_CONFIG.LOGIN
// OR for dynamic endpoints:
url: API_CONFIG.GET_USER(userId)
```

---

## Import Examples

Depending on folder depth, the import path changes:

```javascript
// From login (src/screens/login/index.js):
import API_CONFIG from '../../config/api';

// From MakerScreens/home (src/screens/MakerScreens/home/index.js):
import API_CONFIG from '../../../../config/api';

// From UserScreens/order (src/screens/UserScreens/order/index.js):
import API_CONFIG from '../../../config/api';

// From nested folders:
import API_CONFIG from '../../../../../config/api';
```

---

## PRODUCTION SETUP (CRITICAL!)

After all files are updated, you MUST:

### 1. Update the API_CONFIG for production:
Edit `src/config/api.js` and change:
```javascript
const PRODUCTION_API_URL = 'https://your-production-server.com';
```

To your actual deployed server URL, for example:
- `https://khamang-api.herokuapp.com` (if using Heroku)
- `https://api.khamang.com` (if using custom domain)
- `https://your-aws-instance.com` (if using AWS)

### 2. Ensure your backend server is:
- Deployed and accessible from internet
- Using HTTPS (required for Google Play Store)
- Has CORS headers enabled to allow requests from mobile app
- Running and tested before release

### 3. In the backend, add these CORS headers:
```javascript
// In your express app or middleware
app.use(cors({
  origin: '*',  // or specify allowed domains
  credentials: true
}));
```

---

## API Configuration Details

The config file in `src/config/api.js` automatically detects:
- **Development mode** (`__DEV__`): Uses `http://10.0.2.2:3000` (emulator)
- **Production mode** (when building AAB): Uses the `PRODUCTION_API_URL`

So in development:
- Emulator/local testing → Uses local PC server (10.0.2.2)
- Real Android phone → WILL NOT WORK (needs real server)

After production setup:
- All phones → Uses your deployed server
- Everyone gets same experience ✅

---

## Testing Checklist

Before submitting to Play Store:
- [ ] All API calls use API_CONFIG
- [ ] Production URL is set in config/api.js
- [ ] Backend server is deployed and accessible
- [ ] Test on real Android phone (not emulator)
- [ ] Test login, signup, orders, menu management
- [ ] All features work on real phone

---

## Commands to Batch Update Files

If you want to automate this in VS Code:
1. Press `Ctrl+H` to open Find & Replace
2. Enable "Regex" mode
3. Find: `url: ['"]http://10\.0\.2\.2:3000/api/v1/([^'"]+)['"]`
4. Replace: `url: API_CONFIG.$1` (you'll need to adjust for specific endpoints)

OR search for specific endpoints one by one using Find & Replace.

---

## Summary

**Right now:**
❌ App works on emulator using hardcoded local IP
❌ Will NOT work on Google Play Store (real phones)
❌ Users see connection errors

**After updates:**
✅ App works on emulator (dev mode)
✅ App works on real phones (production URL)
✅ Users can download from Play Store and it works perfectly
✅ Everyone connects to your live backend server

---

**Action Item:** Complete the remaining file updates following the patterns shown, then update the production URL in `config/api.js` before building the final AAB for Play Store!
