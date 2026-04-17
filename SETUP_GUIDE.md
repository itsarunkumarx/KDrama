# KDramaX - Complete Setup Guide 🎬

## Project Overview
KDramaX is a beautiful, full-stack Korean drama streaming platform with real-time watch parties, three-tier access control, and Netflix-style UI.

**Tech Stack:** MERN (MongoDB, Express, React, Node.js)

---

## 📋 Prerequisites

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local installation: [MongoDB Community](https://www.mongodb.com/try/download/community)
  - **OR** Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (FREE)
- **Git** (optional)
- **TMDB API Key** - [Get Free API](https://www.themoviedb.org/settings/api)

---

## 🚀 Quick Start

### Step 1: Setup MongoDB

**Option A: Local MongoDB (Windows)**
1. Download & install MongoDB Community Edition
2. Make sure MongoDB service is running (Services → MongoDB Server)
3. MongoDB will be available at `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with username & password
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/kdrama-app`

---

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies (already done, but if needed)
npm install

# Check if .env file exists
dir .env

# If .env doesn't exist, create it with:
# - MONGODB_URI=your_connection_string
# - TMDB_API_KEY=your_tmdb_api_key
# - JWT_SECRET=your_secret_key
# - PORT=5000
```

**Get TMDB API Key:**
1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Create an account (free)
3. Request an API key for personal use
4. Copy your API key

**Update backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/kdrama-app
TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
JWT_SECRET=your_secret_key_2024
PORT=5000
NODE_ENV=development
```

**Seed Database (Create Admin User):**
```bash
npm run seed

# Output should show:
# ✅ Admin created: arunkumarpalani428@gmail.com
# Admin password: Arunkumar@2006
```

**Start Backend Server:**
```bash
npm run dev

# Should show:
# ✅ MongoDB Connected
# 🚀 Server running on http://localhost:5000
```

---

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies (already done, but if needed)
npm install

# Start development server
npm run dev

# Should show:
# ➜  Local:   http://localhost:5173/
```

---

## 🔐 Three-Tier Access System

### 1️⃣ **Normal User Login**
- Email: any@email.com
- Password: any password (min 6 chars)
- Access: Browse, search, watch trailers, create watch parties

**Create Account:**
```
Sign In → Create Account → Enter Name, Email, Password
```

### 2️⃣ **Favorite Access (Special Guest)**
- Requires: Email + admin-generated code
- Use admin panel to generate invitation codes
- Each code is unique and can expire

**Admin Panel → Generate Code:**
1. Go to http://localhost:5173/admin (after logging in as admin)
2. Click "Generate Code" tab
3. Enter: Name, Email, Expiry (in days)
4. Share the generated code with your guests
5. Guests log in via "⭐ Favorite Access Login" on login page

### 3️⃣ **Admin Dashboard**
- Admin Email: `arunkumarpalani428@gmail.com`
- Admin Password: `Arunkumar@2006`

**Admin Features:**
- 📊 Dashboard - View stats (users, favorites, codes)
- ⭐ Favorite Users - Manage special access users
- 🔑 Generate Code - Create invitation codes for friends
- 👥 All Users - Manage all users (activate/deactivate)
- 📋 View Codes - See all generated access codes

---

## 📱 Features

### ✨ Beautiful Login Pages
- Animated backgrounds with floating orbs
- Smooth field transitions
- Three separate login flows
- Real-time validation

### 🎬 K-Drama Browsing
- **Home Page** - Trending, New Releases, Romance, Action categories
- **Browse All** - Full pagination support
- **Search** - Search by title
- **Filter** - By genre/category
- **Details** - Watch trailers and full drama info

### 👥 Watch Party (Real-time)
- Create watch parties with friends
- Real-time video synchronization
- Live chat with messages
- Host controls playback for everyone
- Share room link with friends

### 👤 User Features
- Profile management
- Watchlist (add/remove dramas)
- Favorites
- Login history

### ⚡ Admin Panel
- User management
- Access code generation
- User statistics
- Code expiration management

---

## 🌐 URLs & Navigation

**Frontend:** http://localhost:5173

- `/` - Home page
- `/login` - Login page
- `/register` - Create account
- `/favorite-login` - Special access login
- `/search` - Browse all dramas
- `/watch/:dramaId` - Watch drama details
- `/party/:roomId` - Join watch party
- `/profile` - User profile
- `/admin` - Admin dashboard (admin only)

**Backend API:** http://localhost:5000

- `/api/auth/*` - Authentication
- `/api/dramas/*` - Drama data
- `/api/rooms/*` - Watch party rooms
- `/api/admin/*` - Admin endpoints (secure)

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Error: connect ECONNREFUSED
```
**Solution:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check MONGODB_URI format

### TMDB API Error
```
❌ Error: api_key not provided
```
**Solution:**
- Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- Log in to your account
- Copy your API key
- Update `TMDB_API_KEY` in backend/.env

### Port Already in Use
```
❌ Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in backend/.env (e.g., PORT=5001)
- Or kill process using the port

### Can't Load Drama Images
**Solution:**
- Ensure TMDB API key is valid
- Check internet connection
- Verify API has appropriate permissions

---

## 📝 Project Structure

```
kdrama-app/
├── backend/
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   ├── seed.js              # Database seeding
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── api/             # API clients
│   │   ├── index.css        # Global styles
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── android/                 # React Native app (bonus)
├── README.md
└── SETUP_GUIDE.md
```

---

## 🎨 Customization

### Change Admin User
Edit `backend/seed.js`:
```javascript
const admin = await User.create({
  name: 'Your Name',
  email: 'your@email.com',
  password: 'your_password',
  role: 'admin'
});
```

Then run: `npm run seed` (in backend folder)

### Customize Colors
Edit `frontend/src/index.css`:
```css
:root {
  --kdark: #0a0a0f;      /* Background */
  --kcard: #141420;      /* Card background */
  --kred: #e50914;       /* Primary red */
  --kgold: #f5c518;      /* Accent gold */
}
```

### Change API URLs
Edit `frontend/src/api/backend.js` to point to your backend server

---

## 📦 Production Deployment

Before deploying:

1. **Update .env:**
   ```env
   NODE_ENV=production
   JWT_SECRET=YOUR_VERY_SECURE_SECRET_KEY
   MONGODB_URI=YOUR_ATLAS_CONNECTION_STRING
   ```

2. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy Backend:**
   - Use Heroku, Railway, or Render
   - Set environment variables in deployment platform

4. **Deploy Frontend:**
   - Use Vercel, Netlify, or Render
   - Update API baseURL to production backend

---

## 🎯 Next Steps

✅ Setup MongoDB  
✅ Configure .env files  
✅ Start backend (`npm run dev` in backend/)  
✅ Start frontend (`npm run dev` in frontend/)  
✅ Sign up as normal user  
✅ Log in as admin and generate invite codes  
✅ Invite friends with favorite access  
✅ Create watch parties and enjoy!  

---

## 📞 Support

**Common Issues:**
- Check that both backend and frontend servers are running
- Verify MongoDB is connected (look for "✅ MongoDB Connected")
- Check browser console for errors (F12)
- Try clearing cache: Ctrl+Shift+Del

**More Help:**
- Check backend console for API errors
- Check frontend browser console for client errors
- Verify all environment variables are set correctly

---

## 🎉 Enjoy!

You now have a beautiful, fully functional K-drama streaming platform! Share the watch party links with friends and enjoy watching together! 🎬✨

For your special setup for your female friend, you can:
1. Create an admin account for her
2. Generate special access codes for her friends
3. Customize colors and features as needed
4. Deploy to production for everyone to enjoy

Have fun! 🎊
