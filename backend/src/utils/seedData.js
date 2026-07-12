const User = require('../models/User');
const Table = require('../models/Table');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // 1. Check if admin exists, if not create one
    const adminExists = await User.findOne({ email: 'admin@restaurant.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@restaurant.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // 2. Check if tables exist, if not seed them
    const tablesCount = await Table.countDocuments();
    if (tablesCount === 0) {
      const tables = [
        { tableNumber: 1, capacity: 2 },
        { tableNumber: 2, capacity: 2 },
        { tableNumber: 3, capacity: 4 },
        { tableNumber: 4, capacity: 4 },
        { tableNumber: 5, capacity: 4 },
        { tableNumber: 6, capacity: 6 },
        { tableNumber: 7, capacity: 6 },
        { tableNumber: 8, capacity: 8 }
      ];
      await Table.insertMany(tables);
      console.log('✅ Tables seeded successfully');
    } else {
      console.log(`ℹ️ ${tablesCount} tables already exist`);
    }

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

module.exports = seedData;