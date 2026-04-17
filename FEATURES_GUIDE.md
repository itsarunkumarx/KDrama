# 🎬 KDramaX - Complete Setup & Features Guide

## 🚀 Quick Start

### First Time Setup
1. Start **Backend**: `cd backend && npm run seed && npm run dev`
2. Start **Frontend**: `cd frontend && npm run dev`
3. Open: http://localhost:5173

---

## 🎯 NEW: Beautiful Entry Page with Three Login Cards

When you visit the app, you'll now see a beautiful **landing page** with three distinct login options:

### 1️⃣ **Normal Login** (Red Theme - Netflix Style)
- **Access**: Browse K-dramas, search, create watch parties
- **For**: Existing users with email & password
- **Colors**: Red & Pink gradient
- **Icon**: 👤

**How to Use:**
1. Click "Sign In" card on landing page
2. Enter email & password
3. Get instant access to all features

---

### 2️⃣ **Create Account** (Emerald/Teal Theme - Fresh)
- **Access**: New users
- **Features**: Quick 2-step registration process
- **Colors**: Emerald & Teal gradient
- **Icon**: ✨

**How to Use:**
1. Click "Create Account" card
2. **Step 1**: Enter Name & Email
3. **Step 2**: Create strong password
4. Instant account creation & login

---

### 3️⃣ **Exclusive Access** (Purple Theme - Premium)
- **Access**: VIP guests with invite codes
- **Colors**: Purple & Indigo gradient
- **Icon**: ⭐
- **Special**: Admin-generated codes only

**How to Use:**
1. Click "Exclusive Access" card
2. Enter email provided by admin
3. Enter the invitation code (8 characters)
4. Get premium features instantly

---

## 👨‍💼 Admin Account

**Login Credentials:**
- **Email**: `arunkumarpalani428@gmail.com`
- **Password**: `Arunkumar@2006`
- **Use**: Normal Login with RED card

### Admin Dashboard Tasks:
1. **View Stats** - See user counts and engagement
2. **Generate Codes** - Create VIP invite codes
3. **Manage Users** - Activate/deactivate accounts
4. **Monitor Access** - Track who used which codes

**Generate VIP Codes:**
1. Admin Panel → "Generate Code" tab
2. Enter: Name, Email, Expiry (days)
3. Share the generated code with friends
4. Friends use "Exclusive Access" to login

---

## 🎨 Color Scheme Overview

The app now uses three beautiful color themes:

| Theme | Colors | Pages | Usage |
|-------|--------|-------|-------|
| **RED** | Red → Pink | Normal Login | Netflix-style, existing users |
| **EMERALD** | Emerald → Teal | Register | Fresh, new members |
| **PURPLE** | Purple → Indigo | Exclusive Access | Premium, VIP guests |

---

## 🌐 Navigation Flow

```
Landing Page (Entry)
├── Normal Login (RED) → Home
├── Create Account (EMERALD) → Home
└── Exclusive Access (PURPLE) → Home
```

**From Home:**
- Navbar → All navigation
- Logo → Back to Home
- Sign Out → Back to Entry page

---

## 🎬 Features You Can Enjoy

### 📺 **Browse K-Dramas**
- Home page: Trending, New Releases, Categories
- Click "🎬 All K-Dramas" to browse all
- Search by title
- Filter: Romance, Action, New, Popular

### 👥 **Watch Party**
- Select any drama
- Click "👥 Start Watch Party"
- Share room link with friends
- Watch together with real-time sync
- Live chat on the side

### ⭐ **Favorite Features** (Purple Card Users)
- VIP status badge
- Priority features
- Special content access

### 👤 **User Profile**
- Edit profile
- View watchlist
- See watch history

---

## 🔧 Important Credentials

### For Testing:

**Admin User:**
```
Email: arunkumarpalani428@gmail.com
Password: Arunkumar@2006
Role: admin
Access: RED Login Card
```

**Test User (Create Your Own):**
```
Use GREEN Card → Create Account
Fill name, email, password
Get instant access
```

**VIP Guest (For Testing Exclusive):**
```
1. Login as Admin (RED card)
2. Go to Admin Panel
3. Generate Code for test email
4. Logout
5. Use PURPLE Card with email & code
```

---

## 📱 Responsive Design

✅ Works on:
- Desktop (Full 3-column layout)
- Tablet (2-column layout)
- Mobile (1 column, vertical scroll)

---

## 🚦 Troubleshooting

### Password Visibility Toggle
- Purple Card: Click eye icon to show/hide password
- Red Card: Automatic handling

### Card Animations
- Hover over cards for scale & glow effects
- Click to navigate to login page
- Smooth transitions on all interactions

### Going Back
- From any login page → Click back arrow
- Returns to Entry page with all 3 cards

---

## 💡 Tips for Your Special Project

For your female friend's app:

1. **Customize Admin:**
   - Edit `backend/seed.js` with her email
   - Create her admin account with special name

2. **Generate Codes:**
   - Use admin to create codes for her friends
   - Each code is unique & can expire

3. **Personalize:**
   - Change colors in `frontend/src/pages/Entry.jsx`
   - Customize feature descriptions
   - Add her branding

4. **Deploy:**
   - Backend: Heroku/Railway
   - Frontend: Vercel/Netlify
   - Database: MongoDB Atlas (cloud)

---

## 🎉 Ready to Go!

You now have:
✅ Beautiful 3-card entry system
✅ Premium color theme throughout
✅ Full authentication system
✅ Watch party with real-time sync
✅ Admin management panel
✅ 500+ K-dramas available
✅ VIP invite system

**Start using it now:**
```bash
cd frontend && npm run dev
```

Then visit: **http://localhost:5173**

Enjoy your K-drama streaming experience! 🎬✨
