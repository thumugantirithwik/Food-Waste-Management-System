const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food-waste-management';

const users = [
  {
    name: 'Admin User',
    email: 'admin@fwms.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '9000000001',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isVerified: true,
    isActive: true,
    bio: 'System administrator',
  },
  {
    name: 'Ramesh Kumar',
    email: 'donor1@fwms.com',
    password: 'Donor@123',
    role: 'donor',
    phone: '9000000002',
    address: '12, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    isVerified: true,
    isActive: true,
    bio: 'Restaurant owner, donating surplus food daily',
  },
  {
    name: 'Priya Sharma',
    email: 'donor2@fwms.com',
    password: 'Donor@123',
    role: 'donor',
    phone: '9000000003',
    address: '45, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    isVerified: true,
    isActive: true,
    bio: 'Home baker sharing excess baked goods',
  },
  {
    name: 'Helping Hands NGO',
    email: 'ngo1@fwms.com',
    password: 'NGO@123',
    role: 'ngo',
    phone: '9000000004',
    organizationName: 'Helping Hands Foundation',
    organizationRegNo: 'NGO-MH-2019-001',
    address: '78, CST Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400098',
    isVerified: true,
    isActive: true,
    bio: 'Working to eliminate hunger in Mumbai slums',
  },
  {
    name: 'Green Earth NGO',
    email: 'ngo2@fwms.com',
    password: 'NGO@123',
    role: 'ngo',
    phone: '9000000005',
    organizationName: 'Green Earth Society',
    organizationRegNo: 'NGO-KA-2020-045',
    address: '23, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    isVerified: true,
    isActive: true,
    bio: 'Reducing food waste and feeding communities',
  },
  {
    name: 'Arjun Volunteer',
    email: 'volunteer@fwms.com',
    password: 'Vol@123',
    role: 'volunteer',
    phone: '9000000006',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    isVerified: true,
    isActive: true,
    bio: 'Passionate about fighting hunger, available on weekends',
  },
];

const getSampleDonations = (donorIds) => [
  {
    donor: donorIds[0],
    donorName: 'Ramesh Kumar',
    donorPhone: '9000000002',
    title: 'Fresh Cooked Biryani',
    category: 'cooked-food',
    description: 'Freshly cooked chicken biryani, enough for 50 people. Made hygienically in our restaurant kitchen.',
    quantity: 50,
    quantityUnit: 'portions',
    quantityAvailable: 50,
    vegetarian: false,
    allergens: 'Contains gluten, dairy',
    storageRequirements: 'Keep warm or refrigerate within 2 hours',
    preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    pickupAddress: '12, MG Road, Near City Mall',
    pickupCity: 'Bangalore',
    pickupState: 'Karnataka',
    pickupPincode: '560001',
    pickupAvailability: '12 PM - 4 PM',
    status: 'available',
    views: 12,
  },
  {
    donor: donorIds[0],
    donorName: 'Ramesh Kumar',
    donorPhone: '9000000002',
    title: 'Surplus Bread and Rolls',
    category: 'bakery',
    description: 'Assorted bread loaves and dinner rolls from today\'s baking. Best consumed within 24 hours.',
    quantity: 20,
    quantityUnit: 'kg',
    quantityAvailable: 20,
    vegetarian: true,
    allergens: 'Contains gluten, may contain nuts',
    storageRequirements: 'Store at room temperature',
    preparedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
    pickupAddress: '12, MG Road, Near City Mall',
    pickupCity: 'Bangalore',
    pickupState: 'Karnataka',
    pickupPincode: '560001',
    pickupAvailability: '9 AM - 7 PM',
    status: 'available',
    views: 7,
  },
  {
    donor: donorIds[1],
    donorName: 'Priya Sharma',
    donorPhone: '9000000003',
    title: 'Fresh Fruits Assortment',
    category: 'fruits',
    description: 'Mixed seasonal fruits - apples, bananas, oranges. Perfectly ripe and ready to eat.',
    quantity: 15,
    quantityUnit: 'kg',
    quantityAvailable: 15,
    vegetarian: true,
    allergens: 'None',
    storageRequirements: 'Store in cool dry place',
    preparedAt: new Date(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    pickupAddress: '45, Anna Nagar West',
    pickupCity: 'Chennai',
    pickupState: 'Tamil Nadu',
    pickupPincode: '600040',
    pickupAvailability: '10 AM - 6 PM',
    status: 'available',
    views: 5,
  },
  {
    donor: donorIds[1],
    donorName: 'Priya Sharma',
    donorPhone: '9000000003',
    title: 'Homemade Cakes and Pastries',
    category: 'bakery',
    description: 'Assorted celebration cakes and pastries leftover from an event. Chocolate, vanilla, and fruit flavors.',
    quantity: 30,
    quantityUnit: 'portions',
    quantityAvailable: 30,
    vegetarian: true,
    allergens: 'Contains gluten, dairy, eggs',
    storageRequirements: 'Refrigerate if not consumed within 4 hours',
    preparedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
    pickupAddress: '45, Anna Nagar West',
    pickupCity: 'Chennai',
    pickupState: 'Tamil Nadu',
    pickupPincode: '600040',
    pickupAvailability: '2 PM - 8 PM',
    status: 'available',
    views: 20,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await FoodDonation.deleteMany({});
    console.log('🗑️  Cleared existing users and donations');

    // Hash passwords and create users
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({ ...userData, password: hashedPassword });
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.email} (${user.role})`);
    }

    // Create sample donations (donors are index 1 and 2 in createdUsers)
    const donorIds = [createdUsers[1]._id, createdUsers[2]._id];
    const sampleDonations = getSampleDonations(donorIds);

    for (const donationData of sampleDonations) {
      const donation = await FoodDonation.create(donationData);
      console.log(`🍲 Created donation: ${donation.title}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('  Admin:     admin@fwms.com    / Admin@123');
    console.log('  Donor 1:   donor1@fwms.com   / Donor@123');
    console.log('  Donor 2:   donor2@fwms.com   / Donor@123');
    console.log('  NGO 1:     ngo1@fwms.com     / NGO@123');
    console.log('  NGO 2:     ngo2@fwms.com     / NGO@123');
    console.log('  Volunteer: volunteer@fwms.com / Vol@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
