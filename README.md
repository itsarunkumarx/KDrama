# 🎬 KDramaX — The Ultimate K-Drama Streaming Experience

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

KDramaX is a premium, full-stack streaming application designed for K-Drama enthusiasts. It offers a Netflix-style interface, high-performance streaming, real-time social features, and a native Android application.

---

## ✨ Key Features

### 📺 Advanced Video Streaming (SuperPlayer)
Our custom **SuperPlayer** provides a cinema-grade viewing experience:
- **Gesture Controls**: Swipe on the right for Volume, left for Brightness.
- **Playback Speed**: Adjust from 0.5x to 2.0x.
- **Picture-in-Picture (PiP)**: Keep watching while you browse other apps.
- **Full Episode Support**: Seamlessly navigate between seasons and episodes.
- **Vidsrc Integration**: Access a massive library of K-Dramas with multiple server options.

### 👥 Social & Interactive
- **Synced Watch Parties**: Create a room and watch with friends in perfect synchronization.
- **Live Chat**: Real-time interaction during watch parties using Socket.io.
- **Room Sharing**: Instant room IDs for quick joining.

### 🔐 Multi-Tier Authentication

1. **👤 Normal Login (Red)**: Standard access for registered users.
2. **✨ Fresh Start (Emerald)**: Modern 2-step registration for new members.

---

## 🛠️ Tech Stack

| Layer | Technology | Usage |
|-------|------------|-------|
| **Frontend** | React 18, Vite | High-performance Web UI |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Backend** | Node.js, Express | Scalable API & Logic |
| **Database** | MongoDB, Mongoose | Flexible data storage |
| **Real-time** | Socket.io | Watch Party & Chat sync |
| **External APIs** | Trakt.tv & TMDB | Comprehensive drama metadata |
| **Mobile** | React Native, Expo | Native Android Experience |

---

## 📁 Project Structure

```text
kdrama-app/
├── backend/          # Node.js API, Socket.io, Schemas
├── frontend/         # React + Vite Web Application
├── android/          # React Native + Expo Mobile App
└── NEEDED/           # Setup assets & documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: A running Atlas cluster or local instance
- **API Keys**: Trakt.tv & TMDB API keys

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env based on .env.example
npm run seed  # Initialize admin account
npm run dev   # Start server on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Start web app on http://localhost:5173
```

### 4. Mobile Setup
```bash
cd android
npm install
# Update backend URL in src/config.js
npx expo start
```

---


---

## 🔧 Environment Variables (.env)

Ensure your `backend/.env` contains:
```text
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
TMDB_API_KEY=your_tmdb_key
TRAKT_CLIENT_ID=your_trakt_id
TRAKT_CLIENT_SECRET=your_trakt_secret
```

---


**Enjoy your K-Drama journey! 🍿🎥**
