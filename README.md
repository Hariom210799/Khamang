# 🍽️ Khamang - Empowering Local Food Makers

**Connecting hungry customers with passionate home-based food creators**

---

## Overview

Khamang is a full-stack, production-ready **food delivery marketplace** that bridges the gap between talented home-based food makers and customers seeking authentic, homemade meals. Unlike generic delivery platforms, Khamang is purpose-built to empower local creators by providing them with powerful order management, real-time analytics, and menu control—while giving customers a seamless, intuitive shopping experience.

The problem it solves: Small-scale food makers lack accessible platforms to reach customers and manage their operations efficiently. Customers want authentic, homemade food but have limited visibility into local makers. Khamang is the answer—a dual-sided marketplace that creates opportunity.

**Why it matters:** Every transaction on Khamang directly supports local entrepreneurs and keeps money circulating within communities.

---

## Key Features

### 👤 **For Customers (User Flow)**
- 🔍 **Browse Local Makers** - Discover food makers near you with real-time availability
- 📋 **Detailed Menus** - View dishes, prices, descriptions, and maker specialties
- 🛒 **Seamless Checkout** - One-tap ordering with intuitive cart management
- 💳 **Secure Payments** - Razorpay integration for safe, encrypted transactions
- 📍 **Order Tracking** - Real-time order status updates and delivery tracking
- 📜 **Order History** - Track past purchases and reorder favorites instantly
- ⭐ **Smart Recommendations** - Personalized suggestions based on order history

### 👨‍🍳 **For Food Makers (Maker Flow)**
- 📊 **Dashboard Analytics** - Real-time sales insights, revenue tracking, and customer metrics
- 📝 **Menu Management** - Add, edit, and organize dishes with photos and descriptions
- 📬 **Order Management** - Accept/reject orders with real-time notifications
- 💰 **Revenue Tracking** - Visualize daily earnings and sales trends
- 📚 **Learning Hub** - Access recipes, food safety tips, and business growth resources
- ⚙️ **Account Settings** - Manage profile, payment methods, and preferences

### 🎯 **General Features**
- 🔐 **Secure Authentication** - Email-based login with bcrypt password hashing
- 📱 **Fully Responsive** - Optimized for all device sizes and orientations
- ⚡ **High Performance** - Redux state management, optimized re-renders
- 🎨 **Modern UI** - Built with UI Kitten, clean and intuitive design language
- 🌐 **Scalable Backend** - RESTful API with MongoDB, error handling, middleware
- 📲 **Cross-Platform** - Native Android app with iOS compatibility

---

## Tech Stack

### **Frontend**
- **React Native** (v0.83.1) - Cross-platform mobile development
- **Redux** - Centralized state management for complex app flows
- **React Navigation** - Tab-based and stack-based navigation
- **UI Kitten** (v5.2.0) - Enterprise-grade UI components
- **Axios** - HTTP client for API communication
- **Razorpay** - Secure payment gateway integration

### **Backend**
- **Node.js + Express.js** - RESTful API server
- **MongoDB** - NoSQL database for flexible data modeling
- **Bcrypt** - Secure password hashing and validation
- **Middleware** - CORS, authentication, error handling
- **RESTful Architecture** - Clean, stateless API design

### **Tools & Infrastructure**
- **Android Gradle Build System** - Native Android compilation
- **Metro Bundler** (v0.83.3) - JavaScript bundling and optimization
- **Git & GitHub** - Version control and collaboration
- **Google Play Console** - App distribution and analytics

---

## System Architecture

Khamang follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Client                       │
│  (Android APK/AAB) - Redux State, React Navigation, UI Kitten│
└────────────────────────┬────────────────────────────────────┘
                         │ Axios HTTP Requests
                         │ (JSON over REST)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js Express API Server                   │
│  - Authentication Controllers                                │
│  - Order Management Controllers                              │
│  - Category/Menu Controllers                                 │
│  - Analytics Controllers                                     │
│  - Middleware (Auth, CORS, Error Handling)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose ODM
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Database (Collections)                   │
│  - Users (auth credentials, profiles)                        │
│  - Makers (store details, menu)                              │
│  - Orders (transaction records)                              │
│  - Categories (dish classifications)                         │
│  - Analytics (sales metrics)                                 │
└─────────────────────────────────────────────────────────────┘
```

**Design Patterns Used:**
- **MVC Pattern** - Controllers handle business logic, Models manage data
- **Redux Pattern** - Single source of truth for app state
- **Middleware Pattern** - Express middleware for cross-cutting concerns
- **Factory Pattern** - Navigation stack builders for code reuse

---

## How It Works

### **User Journey (Ordering Flow)**

1. **Authentication** → User logs in with email/password (validated against bcrypt hash in DB)
2. **Browse** → Redux loads list of makers from `/api/makers` endpoint
3. **Explore** → User selects a maker, views their menu/categories
4. **Add to Cart** → Selected dishes stored in Redux cart state
5. **Checkout** → Razorpay payment gateway initializes
6. **Order Created** → POST request to `/api/orders` creates database record
7. **Tracking** → Real-time order status updates via polling
8. **Delivery** → Notification sent when order is ready
9. **History** → Order appears in user's order history screen

### **Maker Journey (Sales Flow)**

1. **Authentication** → Maker logs in, Redux loads their dashboard
2. **Dashboard** → Analytics calculated from order history (daily revenue, order count)
3. **Incoming Order** → Real-time notification when customer places order
4. **Order Management** → Maker accepts/rejects orders
5. **Menu Update** → Maker can add/edit/delete dishes (updated in MongoDB)
6. **Insights** → Revenue trends visualized on Insights screen
7. **Analytics** → Sales data aggregated and displayed with charts

### **Technical Flow (Example: Placing an Order)**

```javascript
User clicks "Place Order"
    ↓
Redux action dispatched: placeOrder(orderData)
    ↓
Axios POST to /api/orders with cart items, user ID, payment token
    ↓
Express controller validates input, checks Razorpay payment
    ↓
MongoDB creates Order document
    ↓
Response returned to Redux
    ↓
Order state updated, navigation to order tracking screen
    ↓
Polling fetches /api/orders/{orderId} every 5 seconds
    ↓
UI updates with real-time order status
```

---

## Installation & Setup

### **Prerequisites**
- Node.js (v16+) and npm/yarn
- Android SDK and Android Studio
- Java Development Kit (JDK 11+)
- Git

### **Backend Setup**

```bash
# Clone repository
git clone https://github.com/Hariom210799/Khamang.git
cd Khamang

# Install backend dependencies
npm install

# Create .env file with database credentials
echo "MONGODB_URI=mongodb://localhost:27017/khamang" > .env
echo "PORT=3000" >> .env

# Start MongoDB (ensure it's running)
# On Windows: mongod
# On Mac/Linux: mongod

# Start backend server
node src/server/server.js
# Server runs on http://localhost:3000
```

### **Frontend Setup (React Native)**

```bash
# Install frontend dependencies
npm install

# For Android development
cd android
./gradlew.bat clean build  # Windows

# Start Metro bundler
npm start

# In another terminal, build and deploy to Android device
npx react-native run-android

# Or build release APK/AAB for Google Play
cd android
./gradlew.bat bundleRelease  # Creates app-release.aab
```

### **Environment Variables**
Create a `config.env` file in the root:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/khamang
PORT=3000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## Usage Instructions

### **Logging In (User Account)**
```
Email: user@example.com
Password: securePassword123

Steps:
1. Launch Khamang app
2. Tap "Login"
3. Enter email and password
4. Tap "Sign In"
5. Dashboard loads with available makers nearby
```

### **Logging In (Maker Account)**
```
Email: maker@example.com
Password: makerPassword123

Steps:
1. Launch app, tap "Sign In as Maker"
2. Enter credentials
3. View your dashboard with orders and analytics
```

### **Placing an Order (User Flow)**
```
1. From Home tab, browse makers
2. Tap a maker to view their menu
3. Select categories (e.g., "Breakfast", "Lunch")
4. Add dishes to cart (tap dish → select quantity → Add)
5. Open cart (bottom menu)
6. Review items and total price
7. Tap "Proceed to Checkout"
8. Enter delivery address
9. Review order details
10. Tap "Pay with Razorpay"
11. Complete payment on Razorpay page
12. Order confirmation screen displays
13. Track order in real-time
```

### **Managing Menu (Maker Flow)**
```
1. From Menu tab, view all categories and dishes
2. Tap "Edit" on a dish to modify price, description, or image
3. Tap "+" to add new dish to category
4. Fill in details: name, price, description, image
5. Tap "Save"
6. Changes reflect immediately in customer app
```

### **Viewing Analytics (Maker)**
```
1. From Insights tab, see today's revenue
2. Refresh to fetch latest data
3. View: total orders, revenue, items sold
4. Charts display sales trends (if multiple days data)
5. Learn tab shows recipes and tips
```

---

## Project Structure

```
Khamang/
├── src/
│   ├── screens/
│   │   ├── login/                    # Authentication screen
│   │   ├── signup/                   # User registration
│   │   ├── MakerScreens/
│   │   │   ├── home/                 # Maker dashboard & orders
│   │   │   ├── menu/                 # Menu management
│   │   │   ├── menu/category-details # Category/dish management
│   │   │   ├── insights/             # Analytics & revenue
│   │   │   ├── learn/                # Recipes & resources
│   │   │   └── settings/             # Maker account settings
│   │   └── UserScreens/
│   │       ├── order/                # Browse & place orders
│   │       ├── history/              # Order history
│   │       └── profile/              # User account
│   │
│   ├── components/
│   │   ├── atoms/                    # Reusable UI components
│   │   │   ├── CardButton.js         # Custom button component
│   │   │   ├── CardOne.js            # Card component
│   │   │   ├── ListCard.js           # List item card
│   │   │   └── TinyCard.js           # Small card component
│   │   └── DefaultAvatar.js          # Avatar component
│   │
│   ├── redux-store/
│   │   ├── actions/
│   │   │   ├── main-app.js           # User app actions
│   │   │   └── maker-menu.js         # Maker app actions
│   │   ├── reducers/
│   │   │   ├── main-app.js           # User state reducer
│   │   │   └── maker-menu.js         # Maker state reducer
│   │   └── index.js                  # Store configuration
│   │
│   ├── routes/
│   │   ├── app-navigator.js          # Main app navigation
│   │   ├── auth-navigator.js         # Auth stack
│   │   ├── TempSwitch.js             # User/Maker switcher
│   │   ├── MakerNavs/                # Maker bottom tabs
│   │   └── UserNavs/                 # User bottom tabs
│   │
│   ├── server/
│   │   ├── server.js                 # Express app entry point
│   │   ├── app.js                    # App configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic (login, signup)
│   │   │   ├── orderController.js    # Order CRUD operations
│   │   │   └── categoryController.js # Category management
│   │   ├── models/                   # Mongoose schemas
│   │   ├── routes/                   # API endpoints
│   │   └── middleware/               # Auth, error handling
│   │
│   ├── assets/
│   │   ├── images/                   # App images
│   │   ├── icons/                    # Feather & Material icons
│   │   ├── fonts/                    # Custom fonts
│   │   ├── data/
│   │   │   └── menu_data.json        # Mock menu data
│   │   └── themes/
│   │       ├── custom-theme.json     # UI Kitten theme
│   │       └── mapping.json          # Theme mappings
│   │
│   ├── utils/
│   │   ├── dimensions.js             # Device dimensions helper
│   │   ├── imageUtils.js             # Image processing
│   │   ├── appError.js               # Custom error class
│   │   └── catchAsync.js             # Async error wrapper
│   │
│   ├── index.js                      # App entry point
│   └── App.tsx                       # Root component
│
├── android/                          # Native Android code
│   ├── app/
│   │   ├── build/
│   │   │   └── outputs/
│   │   │       └── bundle/
│   │   │           └── release/
│   │   │               └── app-release.aab  # Release bundle
│   │   └── src/
│   │       └── main/
│   │           ├── AndroidManifest.xml
│   │           └── java/                   # Native Android code
│   │
│   ├── build.gradle                  # Project build config
│   ├── gradle.properties              # Gradle settings
│   ├── gradlew / gradlew.bat         # Gradle wrapper scripts
│   └── settings.gradle               # Module settings
│
├── ios/                              # iOS code (Xcode project)
│   ├── khamang/                      # App code
│   └── khamang.xcodeproj/            # Xcode project
│
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript config
├── babel.config.js                   # Babel transpiler config
├── metro.config.js                   # Metro bundler config
├── jest.config.js                    # Testing config
├── app.json                          # React Native config
├── App.tsx                           # Root component
├── index.js                          # Entry point
└── README.md                         # This file
```

---

## Challenges Faced & Solutions

### **Challenge 1: Header Overlap with Device Notches**
**Problem:** On devices with notches (Android), headers were overlapping status bars and becoming unreadable.

**Solution:** Implemented dynamic responsive padding using actual device `StatusBar.currentHeight`:
```javascript
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};
```
Applied across all 8 screens, ensuring headers are always visible on any device.

### **Challenge 2: Refresh Button Not Responding**
**Problem:** Insights screen refresh button was non-functional without navigating away/back.

**Solution:** Changed from `useCallback` (which was returning a function) to `useMemo` (returning JSX component):
```javascript
const RefreshButton = useMemo(() => (
  <TouchableOpacity onPress={handleRefresh}>
    <Text>↻ Refresh</Text>
  </TouchableOpacity>
), [calculateDailyRevenue]);
```

### **Challenge 3: Stale Closures in Data Fetching**
**Problem:** `fetchInsights` wasn't accessing latest Redux state due to closure issues.

**Solution:** 
- Added `calculateDailyRevenue` to dependency array
- Added cleanup effect to reset ref on unmount
- Added comprehensive error logging for debugging

### **Challenge 4: API Request Optimization**
**Problem:** Network requests were being duplicated during component re-renders.

**Solution:** 
- Used refs to track loading state
- Added early returns to prevent duplicate calls
- Implemented cleanup in useEffect

### **Challenge 5: Building for Production**
**Problem:** First-time Android App Bundle (AAB) build required proper signing and key configuration.

**Solution:**
- Created release keystore with strong password
- Configured gradle with signing config
- Built AAB successfully (48.2 MB, signed and optimized)

---

## Future Enhancements

### 📱 **Feature Roadmap**
- **Push Notifications** - Real-time order updates via Firebase Cloud Messaging
- **Rating & Reviews** - Customer reviews and maker ratings system
- **Referral Program** - Incentivize users to refer friends (credits/discounts)
- **Saved Addresses** - Multiple delivery addresses for users
- **Favorites/Wishlist** - Bookmark favorite makers and dishes
- **Live Chat Support** - In-app customer support between users and makers
- **Subscription Orders** - Recurring orders for regular meal subscriptions
- **Maker Analytics Dashboard** - Advanced metrics, graphs, and insights
- **Admin Panel** - Moderation, dispute resolution, fraud detection
- **Payment Methods** - Multiple wallets, credit cards, UPI integration

### ⚡ **Performance Optimizations**
- **Code Splitting** - Lazy load screens to reduce initial bundle size
- **Image Optimization** - Implement image compression and WebP format
- **Caching Strategy** - Implement Redux persist for offline capability
- **Database Indexing** - Optimize MongoDB queries with proper indexing
- **GraphQL Migration** - Replace REST API with GraphQL for efficient data fetching
- **Service Workers** - Enable offline-first capabilities

### 🌍 **Scaling & Infrastructure**
- **Multi-City Support** - Expand to multiple cities/regions
- **Internationalization (i18n)** - Support multiple languages
- **Web Platform** - Build web version using React (share codebase)
- **Cloud Deployment** - Migrate from local to AWS/GCP/Azure
- **CI/CD Pipeline** - Automated testing and deployment
- **Load Balancing** - Implement horizontal scaling for API servers

### 🔒 **Security Enhancements**
- **Two-Factor Authentication (2FA)** - Enhanced account security
- **Encryption at Rest** - End-to-end encryption for sensitive data
- **Rate Limiting** - Prevent brute-force attacks on login/API endpoints
- **Audit Logging** - Track all critical operations for compliance
- **SSL/TLS Everywhere** - Enforce HTTPS across all communications

---

## Learning Outcomes

Building Khamang provided deep understanding of:

✅ **Full-Stack Mobile Development** - React Native to Node.js to MongoDB
✅ **State Management at Scale** - Redux patterns for complex app flows
✅ **RESTful API Design** - Controller patterns, middleware, error handling
✅ **Database Modeling** - Schema design, relationships, indexing
✅ **Authentication & Security** - Password hashing, JWT tokens, input validation
✅ **Payment Integration** - Third-party gateway integration (Razorpay)
✅ **Build & Deployment** - Gradle, app signing, Play Store submission
✅ **Performance Optimization** - Reducing network requests, responsive design
✅ **Responsive Design** - Adapting to different device sizes and notches
✅ **Real-World Problem Solving** - Addressing actual marketplace needs

---

## Contributing Guidelines

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create a feature branch** - `git checkout -b feature/your-feature-name`
3. **Make your changes** - Write clean, well-commented code
4. **Test thoroughly** - Ensure no regression
5. **Commit with clear messages** - `git commit -m "Add feature: description"`
6. **Push to branch** - `git push origin feature/your-feature-name`
7. **Open a Pull Request** - Describe changes and why they're needed

### **Code Standards**
- Use ES6+ syntax
- Follow naming conventions (camelCase for variables, PascalCase for components)
- Add comments for complex logic
- Test on multiple devices before submitting PR
- Keep commits atomic and logical

### **Reporting Issues**
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Attach relevant logs and error messages
- Be respectful and constructive

---

## License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal and commercial purposes.

---

## Author

**Hariom Sharma**

A passionate full-stack developer dedicated to building products that create real impact. Khamang represents my commitment to leveraging technology to empower local food makers and communities.

- 🔗 **GitHub:** [@Hariom210799](https://github.com/Hariom210799)
- 📧 **Email:** hariom@example.com
- 💼 **LinkedIn:** [Hariom Sharma](https://linkedin.com/in/hariom-sharma)

### **Acknowledgments**
- React Native and Expo communities for excellent documentation
- UI Kitten for beautiful, enterprise-grade components
- MongoDB and Node.js for powerful backend capabilities
- Google Play Store team for smooth app submission process

---

**Made with ❤️ for local food makers everywhere**

*Last Updated: January 2, 2026*

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
