const mongoose = require('mongoose');
const User = require('./models/User');
const Drama = require('./models/Drama');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🔗 Connected to MongoDB');

  // Create admin user
  const existing = await User.findOne({ email: 'arunkumarpalani428@gmail.com' });
  if (existing) {
    console.log('✅ Admin already exists');
  } else {
    const admin = await User.create({
      name: 'Arunkumar (Admin)',
      email: 'arunkumarpalani428@gmail.com',
      password: 'Arunkumar@2006',
      role: 'admin'
    });
    console.log('✅ Admin created:', admin.email);
  }

  // Seed popular K-dramas
  const dramas = [
    {
      id: 120168,
      name: 'Squid Game',
      title: 'Squid Game',
      original_name: '오징어 게임',
      poster_path: '/dIWwShnGQixMVVDJSGHVtYayZd5.jpg',
      backdrop_path: '/uc6At2Kg1CoJblouGND1MYgP4Af.jpg',
      overview: 'Hundreds of cash-strapped players accept an invitation to compete in children\'s games for a massive prize, but the stakes are deadly.',
      vote_average: 8.0,
      popularity: 395.123,
      first_air_date: '2021-09-17',
      original_language: 'ko',
      genres: ['Drama', 'Thriller'],
      status: 'Returning Series'
    },
    {
      id: 108978,
      name: 'Descendants of the Sun',
      title: 'Descendants of the Sun',
      original_name: '태양의 후예',
      poster_path: '/jJQeqZh8hspMsQHMjjU7Isvj0c.jpg',
      backdrop_path: '/1FMyWLn9Kz13LN2nPvFVZFa9XwV.jpg',
      overview: 'A mixed love story between a soldier and a surgeon. Love blooms as the tension mounts in the fictional war-torn country.',
      vote_average: 8.4,
      popularity: 250.5,
      first_air_date: '2016-02-24',
      original_language: 'ko',
      genres: ['Romance', 'Drama'],
      status: 'Ended'
    },
    {
      id: 95557,
      name: 'Boys Over Flowers',
      title: 'Boys Over Flowers',
      original_name: '꽃보다 남자',
      poster_path: '/vEKo4L1PN0sxaM0MFLwf8iBl6qf.jpg',
      backdrop_path: '/vEKo4L1PN0sxaM0MFLwf8iBl6qf.jpg',
      overview: 'An ordinary girl gets admitted to an elite school and falls in love with F4, a group of four boys.',
      vote_average: 7.8,
      popularity: 220.3,
      first_air_date: '2009-01-05',
      original_language: 'ko',
      genres: ['Romance', 'Comedy', 'Drama'],
      status: 'Ended'
    },
    {
      id: 121220,
      name: 'Itaewon Class',
      title: 'Itaewon Class',
      original_name: '이태원 클라쓰',
      poster_path: '/tP47MzDLOJLwSYdXNIqJh0X21rn.jpg',
      backdrop_path: '/bXCEMhJqEQ9cC3p8v9ecFrAxAYs.jpg',
      overview: 'An ex-con and his friends fight to make their ambitious dreams for their street bar a reality.',
      vote_average: 8.0,
      popularity: 290.7,
      first_air_date: '2020-03-21',
      original_language: 'ko',
      genres: ['Action', 'Drama'],
      status: 'Ended'
    },
    {
      id: 100088,
      name: 'My Love from the Star',
      title: 'My Love from the Star',
      original_name: '별에서 온 그대',
      poster_path: '/AaXYyPtqkKOKdlP7fBdxIRYmfEU.jpg',
      backdrop_path: '/AaXYyPtqkKOKdlP7fBdxIRYmfEU.jpg',
      overview: 'A human and an alien from the past meet in the future and fall in love.',
      vote_average: 8.3,
      popularity: 245.2,
      first_air_date: '2013-12-16',
      original_language: 'ko',
      genres: ['Romance', 'Comedy', 'Fantasy'],
      status: 'Ended'
    },
    {
      id: 100328,
      name: 'Goblin',
      title: 'Goblin',
      original_name: '도깨비',
      poster_path: '/zH8nVu8gBHBXVmvTgCCEVr0RVpg.jpg',
      backdrop_path: '/zH8nVu8gBHBXVmvTgCCEVr0RVpg.jpg',
      overview: 'A goblin touches a human and his touch turns deadly. A grim reaper and a goblin must work together to protect their loved ones.',
      vote_average: 8.6,
      popularity: 310.8,
      first_air_date: '2016-12-02',
      original_language: 'ko',
      genres: ['Fantasy', 'Romance', 'Drama'],
      status: 'Ended'
    },
    {
      id: 108714,
      name: 'Heirs',
      title: 'The Heirs',
      original_name: '상속자들',
      poster_path: '/qL9fTEJAW9EM5Yx0KBhaBimdkEf.jpg',
      backdrop_path: '/qL9fTEJAW9EM5Yx0KBhaBimdkEf.jpg',
      overview: 'Rich kids study at an elite high school and experience love, friendship, and rivalry.',
      vote_average: 7.9,
      popularity: 235.4,
      first_air_date: '2013-10-09',
      original_language: 'ko',
      genres: ['Romance', 'Drama', 'Comedy'],
      status: 'Ended'
    },
    {
      id: 120856,
      name: 'Crash Landing on You',
      title: 'Crash Landing on You',
      original_name: '사랑의 불시착',
      poster_path: '/gB55V7a8ztf5LLFsOqbG1KHJmLN.jpg',
      backdrop_path: '/gB55V7a8ztf5LLFsOqbG1KHJmLN.jpg',
      overview: 'A woman accidentally paraglides into North Korea and falls in love with an army officer who helps her hide.',
      vote_average: 8.5,
      popularity: 285.6,
      first_air_date: '2019-12-14',
      original_language: 'ko',
      genres: ['Romance', 'Comedy', 'Drama'],
      status: 'Ended'
    },
    {
      id: 37854,
      name: 'Tomorrow With You',
      title: 'Tomorrow With You',
      original_name: '내일 그대와',
      poster_path: '/s3KhZb9nnuJzUXZpMDFnvpnEF3Y.jpg',
      backdrop_path: '/s3KhZb9nnuJzUXZpMDFnvpnEF3Y.jpg',
      overview: 'A man with the ability to travel back in time falls in love with a woman from the future.',
      vote_average: 8.1,
      popularity: 200.3,
      first_air_date: '2017-11-04',
      original_language: 'ko',
      genres: ['Romance', 'Fantasy', 'Drama'],
      status: 'Ended'
    },
    {
      id: 137975,
      name: 'Alchemist Asimov',
      title: 'Alchemist Asimov',
      original_name: '연금술사 아시모프',
      poster_path: '/1GKvRxc9F3qjCd5rYM8KGl3Xg9e.jpg',
      backdrop_path: '/1GKvRxc9F3qjCd5rYM8KGl3Xg9e.jpg',
      overview: 'A mysterious person helps others solve their life problems through supernatural means.',
      vote_average: 7.7,
      popularity: 180.2,
      first_air_date: '2022-05-30',
      original_language: 'ko',
      genres: ['Fantasy', 'Drama'],
      status: 'Ended'
    }
  ];

  // Clear existing dramas
  await Drama.deleteMany({});
  console.log('🗑️  Cleared existing dramas');

  // Seed dramas
  await Drama.insertMany(dramas);
  console.log(`✅ Seeded ${dramas.length} K-dramas`);

  mongoose.disconnect();
  console.log('✨ Done! Run: npm start to launch the server.');
}

seed().catch(console.error);
