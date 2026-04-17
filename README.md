# 🎬 KDramaX — Full Stack K-Drama Streaming App

Netflix-style K-Drama app with **Web + Android**, Watch Party, Group Chat, Admin Panel.

---

## 📁 Project Structure

```
kdramax/
├── backend/          ← Node.js + Express + MongoDB + Socket.io
├── frontend/         ← React + Vite + TailwindCSS (Web)
└── android/          ← React Native + Expo (Android APK)
```

---

## ⚡ STEP 1 — Get API Keys

### TMDB API Key (FREE)
1. Go to → https://www.themoviedb.org/signup
2. Create account → Settings → API → Request API Key (Developer)
3. Copy your **API Key (v3 auth)**

### MongoDB (FREE)
1. Go to → https://cloud.mongodb.com
2. Create free cluster → Connect → Get connection string
   - Looks like: `mongodb+srv://user:pass@cluster.mongodb.net/kdrama_app`

---

## 🖥️ STEP 2 — Setup Backend

```bash
cd kdramax/backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_CONNECTION_STRING
JWT_SECRET=any_random_long_string_here_123456
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

```bash
# Create admin account
npm run seed

# Start server
npm run dev
```

✅ Backend running at: `http://localhost:5000`
✅ Admin login: `arunkumarpalani428@gmail.com` / `Arunkumar@2006`

---

## 🌐 STEP 3 — Setup Frontend (Web)

```bash
cd kdramax/frontend
npm install
npm run dev
```

✅ Web app running at: `http://localhost:3000`

---

## 📱 STEP 4 — Setup Android App

### 4a. Update backend URL

Edit `android/src/config.js`:
```js
// For testing on real phone (same WiFi):
export const BACKEND_URL = 'http://192.168.1.XXX:5000';
// ↑ Replace with YOUR computer's local IP address
// (Run: ipconfig on Windows / ifconfig on Mac/Linux)

// For production (after deploying backend):
// export const BACKEND_URL = 'https://your-backend.onrender.com';
```

### 4b. Install & Run

```bash
cd kdramax/android
npm install

# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Start development (scan QR with Expo Go app)
npx expo start --android
```

---

## 📦 STEP 5 — Build APK File

### Option A: Build APK with EAS (Expo) — Recommended

```bash
cd kdramax/android

# Login to Expo
eas login

# Configure project (one time)
eas build:configure

# Build APK (free, takes ~10-15 mins, runs on Expo's cloud)
eas build --platform android --profile preview
```

After build completes:
- You'll get a **download link** for the `.apk` file
- Install on any Android phone (no Play Store needed)
- Share the APK link with friends!

### Option B: Local APK Build

```bash
cd kdramax/android

# Install Expo Dev Client
npx expo install expo-dev-client

# Generate Android folder
npx expo prebuild --platform android

# Build APK locally (requires Android Studio + JDK 17)
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### Option C: Quick Test on Phone (No Build Needed)
1. Install **Expo Go** app from Play Store
2. Run: `npx expo start`
3. Scan the QR code with Expo Go
4. App runs instantly! ✅

---

## 🚀 STEP 6 — Deploy Backend (Free Hosting)

### Deploy to Render.com (FREE)

1. Push code to GitHub
2. Go to → https://render.com
3. New → Web Service → Connect your GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (same as .env)
6. Deploy! You get a URL like: `https://kdramax-backend.onrender.com`

Update `android/src/config.js` with this URL for production APK.

---

## 👤 Login Types

| Type | How to Login | Access |
|------|-------------|--------|
| **Admin** | Email + Password | Full access + Admin panel |
| **Normal User** | Email + Password (register) | Browse + Watch + Party |
| **Favorite User** | Email + Secret Code (from admin) | All features |

### How to give Favorite access:
1. Login as Admin → Go to `/admin`
2. Click "Generate Code" → Enter friend's name + email
3. Copy the 8-digit code → Send to friend
4. Friend opens app → "⭐ Favorite Login" → Enter email + code

---

## ✨ Features

- 🎬 **Browse K-Dramas** — Trending, New, Romance, Action rows (Netflix-style)
- 🔍 **Search** — Find any K-drama instantly
- 📺 **Watch Trailers** — YouTube embedded player
- 👥 **Watch Party** — Multiple people watch together in sync
- 💬 **Live Chat** — Real-time chat during watch party
- 🔗 **Share Room** — Copy room ID, friends join instantly
- 🆕 **Auto Updates** — New dramas auto-added daily (TMDB cron)
- 👤 **3 Login Types** — User / Favorite (code) / Admin
- ⚡ **Admin Panel** — Manage users, generate invite codes
- 📱 **Android App** — Full native app + APK

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io (watch party + chat) |
| Data | TMDB API (K-Drama data) |
| Scheduler | node-cron (auto-updates) |
| Frontend | React 18, Vite, TailwindCSS |
| Routing | React Router v6 |
| Android | React Native, Expo 51 |
| APK Build | EAS Build (Expo) |

---

## 🔧 Common Issues

**"Network Error" on Android app:**
- Make sure your phone is on same WiFi as computer
- Check the IP in `android/src/config.js`
- Make sure backend is running (`npm run dev`)

**"Cannot connect to MongoDB":**
- Check your MONGODB_URI in .env
- Make sure IP is whitelisted in MongoDB Atlas (allow 0.0.0.0/0)

**TMDB returns no results:**
- Verify TMDB_API_KEY in .env
- TMDB API is free, just needs registration

---

## 📞 Admin Credentials

```
Email: arunkumarpalani428@gmail.com
Password: Arunkumar@2006
```

⚠️ Change password after first login!
