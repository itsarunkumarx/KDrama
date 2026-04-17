const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create admin user
  const existing = await User.findOne({ email: 'arunkumarpalani428@gmail.com' });
  if (existing) {
    console.log('Admin already exists');
  } else {
    const admin = await User.create({
      name: 'Arunkumar (Admin)',
      email: 'arunkumarpalani428@gmail.com',
      password: 'Arunkumar@2006',
      role: 'admin'
    });
    console.log('✅ Admin created:', admin.email);
  }

  mongoose.disconnect();
  console.log('Done! Run: npm start to launch the server.');
}

seed().catch(console.error);
