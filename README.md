# 🎬 KDramaX — Full Stack K-Drama Streaming App

Premium K-Drama experience with **Web + Android**, Watch Party, Live Chat, and seamless Trakt integration.

---

## 📁 Project Structure

```
kdrama-app/
├── backend/          ← Node.js + Express + MongoDB + Socket.io
├── frontend/         ← React + Vite + TailwindCSS (Web)
└── android/          ← React Native + Expo (Android APK)
```

---

## ⚡ STEP 1 — Get API Keys

This project uses a hybrid data setup to ensure reliability and rich metadata:
- **Trakt API**: Primary source for trending, popular, and search data.
- **TMDB API**: Used for fetching season and episode details.

### 1. Trakt API Key
1. Go to → [Trakt API Dashboard](https://trakt.tv/oauth/applications)
2. Create account → Create a New Application
3. Set Redirect URI to: `http://localhost:5000/api/auth/trakt/callback`
4. Copy your **Client ID** and **Client Secret**.

### 2. TMDB API Key
1. Go to → [TMDB Settings](https://www.themoviedb.org/settings/api)
2. Create account → Request API Key (Developer)
3. Copy your **API Key (v3 auth)**.

### 3. MongoDB (FREE)
1. Go to → [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster → Connect → Get connection string.

---

## 🖥️ STEP 2 — Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_CONNECTION_STRING
JWT_SECRET=any_random_long_string_12345
TRAKT_CLIENT_ID=your_trakt_client_id
TRAKT_CLIENT_SECRET=your_trakt_client_secret
TMDB_API_KEY=your_tmdb_api_key
```

```bash
# Start server
npm run dev
```

✅ Backend running at: `http://localhost:5000`

---

## 🌐 STEP 3 — Setup Frontend (Web)

```bash
cd frontend
npm install
npm run dev
```

✅ Web app running at: `http://localhost:3000`

---

## 📱 STEP 4 — Setup Android App

### 4a. Update backend URL
Edit `android/src/config.js` with your computer's local IP or deployed backend URL.

### 4b. Run with Expo
```bash
cd android
npm install
npx expo start --android
```

---

## ✨ Features

- 🎬 **Browse K-Dramas** — Real-time trending and popular lists powered by Trakt.
- 🔍 **Global Search** — Find any K-drama instantly using Trakt's extensive database.
- 👥 **Watch Party** — Synchronized playback for multiple viewers.
- 💬 **Live Chat** — Real-time interaction during watch parties.
- 📺 **Full Metadata** — Detailed season and episode information via TMDB.
- 📱 **Android App** — Premium mobile experience with Expo.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MongoDB |
| APIs | Trakt API (Metadata), TMDB API (Episodes) |
| Real-time | Socket.io (Sync + Chat) |
| Frontend | React 18, Vite, TailwindCSS |
| Mobile | React Native, Expo 51 |

---

## 🔧 Common Issues

**"Trakt API returns no results":**
- Ensure your `TRAKT_CLIENT_ID` is correct and you have authorized the app if required.

**"Images not showing":**
- The app uses the local MongoDB to cache image paths that are not provided by Trakt. Ensure your database is seeded or has data.

**"Network Error" on Android:**
- Ensure your phone and computer are on the same WiFi network and the IP address in `config.js` is correct.
