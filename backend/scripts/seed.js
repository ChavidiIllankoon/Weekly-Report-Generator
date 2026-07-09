const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Project = require('../models/Project');
const Report = require('../models/Report');

const seedData = async () => {
  try {
    console.log('🔄 Checking connection string:', process.env.MONGO_URI);
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected successfully.');

    // Clear existing data
    console.log('🔄 Cleaning database...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Report.deleteMany({});
    console.log('✅ Database cleaned.');

    // Create projects
    console.log('🔄 Seeding projects...');
    const projects = await Project.create([
      { name: 'Client A', description: 'Development of the mobile application and frontend modules' },
      { name: 'Internal Tool', description: 'Optimization of internal company dashboard systems' },
      { name: 'Marketing Website', description: 'Rebranding campaign website development' },
    ]);
    console.log(`✅ Seeded ${projects.length} projects.`);

    // Create users
    console.log('🔄 Seeding users...');
    const member = await User.create({
      name: 'Alice Member',
      email: 'member@test.com',
      password: 'password123',
      role: 'member',
    });

    const manager = await User.create({
      name: 'Bob Manager',
      email: 'manager@test.com',
      password: 'password123',
      role: 'manager',
    });
    console.log('✅ Seeded users:');
    console.log('   - Member: member@test.com / password123');
    console.log('   - Manager: manager@test.com / password123');

    // Create some reports
    console.log('🔄 Seeding reports...');
    const reports = [
      {
        userId: member._id,
        week: '2026-W26',
        project: projects[0]._id, // Client A
        completedTasks: ['Finished login module API integration', 'Implemented password hashing'],
        plannedTasks: ['Start designing Dashboard screens', 'Configure router settings'],
        blockers: [],
        hoursWorked: 38,
        notes: 'Smooth week, no blockers.',
        status: 'Submitted',
      },
      {
        userId: member._id,
        week: '2026-W27',
        project: projects[0]._id, // Client A
        completedTasks: ['Designed Dashboard layout', 'Connected Redux store'],
        plannedTasks: ['Add Chart.js visualizers', 'Fix API layout styling issues'],
        blockers: ['Awaiting final designs for Settings panel'],
        hoursWorked: 42,
        notes: 'Overall good, blocker is minor.',
        status: 'Submitted',
      },
      {
        userId: member._id,
        week: '2026-W27',
        project: projects[1]._id, // Internal Tool
        completedTasks: ['Optimized search query performance'],
        plannedTasks: ['Refactor state management in reports list'],
        blockers: [],
        hoursWorked: 5,
        notes: 'Helped the internal tools team briefly.',
        status: 'Draft',
      },
    ];

    await Report.create(reports);
    console.log('✅ Mock reports seeded.');
    console.log('✨ Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection or Seeding failed:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
