import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional for development)
  // await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;');

  // ===== SEED USERS =====
  console.log('📝 Creating users...');

  const hashedPassword = await bcryptjs.hash('demo@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@examsafejourney.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      phone: '+919876543210',
    },
  });

  const moderatorUser = await prisma.user.create({
    data: {
      email: 'moderator@examsafejourney.com',
      firstName: 'Moderator',
      lastName: 'User',
      password: hashedPassword,
      role: 'MODERATOR',
      isActive: true,
      phone: '+919876543211',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      password: hashedPassword,
      role: 'USER',
      isActive: true,
      phone: '+919876543212',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      firstName: 'Priya',
      lastName: 'Singh',
      password: hashedPassword,
      role: 'USER',
      isActive: true,
      phone: '+919876543213',
    },
  });

  console.log(`✅ Created 4 users (1 admin, 1 moderator, 2 regular)`);

  // ===== SEED EXAM CENTERS =====
  console.log('🏫 Creating exam centers...');

  const examCenters = await Promise.all([
    prisma.examCenter.create({
      data: {
        name: 'Delhi PTS (Allahabad Bank)',
        location: 'Delhi',
        state: 'Delhi',
        city: 'New Delhi',
        latitude: 28.7041,
        longitude: 77.1025,
        examTypes: JSON.stringify(['UPSC CSE', 'SSC CGL', 'SSC CHSL']),
        capacity: 500,
        facilityDetails: JSON.stringify(['AC Rooms', 'Disabled Facilities', 'Parking']),
        contactEmail: 'delhi@pts.com',
        contactPhone: '+91-11-2415-1111',
      },
    }),
    prisma.examCenter.create({
      data: {
        name: 'Mumbai Regional Centre',
        location: 'Mumbai',
        state: 'Maharashtra',
        city: 'Mumbai',
        latitude: 19.076,
        longitude: 72.8479,
        examTypes: JSON.stringify(['GATE', 'CAT', 'UPSC']),
        capacity: 450,
        facilityDetails: JSON.stringify(['AC Rooms', 'Canteen', 'Medical Support']),
        contactEmail: 'mumbai@centre.com',
        contactPhone: '+91-22-6521-1111',
      },
    }),
    prisma.examCenter.create({
      data: {
        name: 'Bengaluru Tech Hub',
        location: 'Bengaluru',
        state: 'Karnataka',
        city: 'Bengaluru',
        latitude: 12.9716,
        longitude: 77.5946,
        examTypes: JSON.stringify(['JEE Advanced', 'GATE CSE', 'CAT']),
        capacity: 600,
        facilityDetails: JSON.stringify(['WiFi', 'Parking', 'Food Court']),
        contactEmail: 'bangalore@tech.com',
        contactPhone: '+91-80-2358-1111',
      },
    }),
    prisma.examCenter.create({
      data: {
        name: 'Kolkata Academic Centre',
        location: 'Kolkata',
        state: 'West Bengal',
        city: 'Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        examTypes: JSON.stringify(['CAT', 'XAT', 'SSC']),
        capacity: 350,
        facilityDetails: JSON.stringify(['AC Rooms', 'Library']),
        contactEmail: 'kolkata@academic.com',
        contactPhone: '+91-33-2237-1111',
      },
    }),
    prisma.examCenter.create({
      data: {
        name: 'Hyderabad Success Centre',
        location: 'Hyderabad',
        state: 'Telangana',
        city: 'Hyderabad',
        latitude: 17.3850,
        longitude: 78.4867,
        examTypes: JSON.stringify(['UPSC', 'GATE', 'CAT']),
        capacity: 400,
        facilityDetails: JSON.stringify(['AC', 'Cafeteria', 'Disabled Access']),
        contactEmail: 'hyderabad@success.com',
        contactPhone: '+91-40-4026-1111',
      },
    }),
  ]);

  console.log(`✅ Created ${examCenters.length} exam centers`);

  // ===== SEED TRAVEL ROUTES =====
  console.log('✈️ Creating travel routes...');

  const travelRoutes = await Promise.all([
    prisma.travelRoute.create({
      data: {
        origin: 'Delhi',
        destination: 'Mumbai',
        transportMode: 'TRAIN',
        distance: 1400,
        estimatedDuration: 1440, // minutes
        basePrice: 2500,
        operatingDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
        providers: JSON.stringify(['Indian Railways', 'Rajdhani Express']),
      },
    }),
    prisma.travelRoute.create({
      data: {
        origin: 'Delhi',
        destination: 'Bengaluru',
        transportMode: 'FLIGHT',
        distance: 2200,
        estimatedDuration: 180,
        basePrice: 4500,
        operatingDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
        providers: JSON.stringify(['Air India', 'IndiGo', 'SpiceJet']),
      },
    }),
    prisma.travelRoute.create({
      data: {
        origin: 'Mumbai',
        destination: 'Hyderabad',
        transportMode: 'BUS',
        distance: 750,
        estimatedDuration: 660,
        basePrice: 1200,
        operatingDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
        providers: JSON.stringify(['Volvo Bus', 'Royal Travels']),
      },
    }),
    prisma.travelRoute.create({
      data: {
        origin: 'Kolkata',
        destination: 'Delhi',
        transportMode: 'TRAIN',
        distance: 1900,
        estimatedDuration: 1920,
        basePrice: 3000,
        operatingDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
        providers: JSON.stringify(['Indian Railways', 'Shatabdi Express']),
      },
    }),
    prisma.travelRoute.create({
      data: {
        origin: 'Bengaluru',
        destination: 'Hyderabad',
        transportMode: 'CAR',
        distance: 580,
        estimatedDuration: 480,
        basePrice: 5000,
        operatingDays: JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
        providers: JSON.stringify(['Self Drive', 'Maniak Rental']),
      },
    }),
  ]);

  console.log(`✅ Created ${travelRoutes.length} travel routes`);

  // ===== SEED STAY LISTINGS =====
  console.log('🏨 Creating stay listings...');

  const stayListings = await Promise.all([
    prisma.stayListing.create({
      data: {
        name: 'Delhi Budget Hotel',
        examCenterId: examCenters[0].id,
        city: 'Delhi',
        address: 'Connaught Place, New Delhi',
        stayType: 'HOTEL',
        pricePerNight: 1500,
        rating: 4.2,
        reviewCount: 45,
        amenities: JSON.stringify(['WiFi', 'AC', 'Hot Water', 'Parking']),
        availableRooms: 20,
        contactPhone: '+91-11-4050-1111',
        contactEmail: 'info@delhibudget.com',
      },
    }),
    prisma.stayListing.create({
      data: {
        name: 'Mumbai Hostel Hub',
        examCenterId: examCenters[1].id,
        city: 'Mumbai',
        address: 'Colaba, Mumbai',
        stayType: 'HOSTEL',
        pricePerNight: 600,
        rating: 4.5,
        reviewCount: 120,
        amenities: JSON.stringify(['WiFi', 'Common Kitchen', 'AC Dormitory', 'Study Area']),
        availableRooms: 50,
        contactPhone: '+91-22-2202-1111',
        contactEmail: 'stay@mumbaihostel.com',
      },
    }),
    prisma.stayListing.create({
      data: {
        name: 'Bengaluru Tech Guest House',
        examCenterId: examCenters[2].id,
        city: 'Bengaluru',
        address: 'Whitefield, Bengaluru',
        stayType: 'GUESTHOUSE',
        pricePerNight: 1200,
        rating: 4.3,
        reviewCount: 78,
        amenities: JSON.stringify(['WiFi', 'Kitchen', 'Laundry', 'Common Room']),
        availableRooms: 15,
        contactPhone: '+91-80-6114-1111',
        contactEmail: 'book@techguesthouse.com',
      },
    }),
    prisma.stayListing.create({
      data: {
        name: 'Kolkata Heritage Hotel',
        examCenterId: examCenters[3].id,
        city: 'Kolkata',
        address: 'Park Street, Kolkata',
        stayType: 'HOTEL',
        pricePerNight: 1800,
        rating: 4.1,
        reviewCount: 92,
        amenities: JSON.stringify(['AC', 'Restaurant', '24/7 Service', 'Room Service']),
        availableRooms: 25,
        contactPhone: '+91-33-2229-1111',
        contactEmail: 'reservations@heritagekolkata.com',
      },
    }),
    prisma.stayListing.create({
      data: {
        name: 'Hyderabad Student Hostel',
        examCenterId: examCenters[4].id,
        city: 'Hyderabad',
        address: 'HITEC City, Hyderabad',
        stayType: 'HOSTEL',
        pricePerNight: 700,
        rating: 4.4,
        reviewCount: 156,
        amenities: JSON.stringify(['WiFi', 'Study Hall', 'Mess', 'AC Rooms']),
        availableRooms: 60,
        contactPhone: '+91-40-6640-1111',
        contactEmail: 'admin@studenthostel.com',
      },
    }),
  ]);

  console.log(`✅ Created ${stayListings.length} stay listings`);

  // ===== SEED REVIEWS =====
  console.log('⭐ Creating reviews...');

  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: user1.id,
        examCenterId: examCenters[0].id,
        rating: 5,
        title: 'Excellent exam center',
        content: 'Very well organized, friendly staff, and good facilities.',
      },
    }),
    prisma.review.create({
      data: {
        userId: user2.id,
        examCenterId: examCenters[1].id,
        rating: 4,
        title: 'Good experience',
        content: 'Clean rooms, adequate parking. Could improve online registration.',
      },
    }),
    prisma.review.create({
      data: {
        userId: user1.id,
        stayListingId: stayListings[0].id,
        rating: 4,
        title: 'Good stay for exam prep',
        content: 'Quiet environment, good WiFi speed, located near center.',
      },
    }),
    prisma.review.create({
      data: {
        userId: user2.id,
        stayListingId: stayListings[1].id,
        rating: 5,
        title: 'Best hostel experience',
        content: 'Budget-friendly, friendly people, lots of study areas.',
      },
    }),
  ]);

  console.log(`✅ Created ${reviews.length} reviews`);

  // ===== SEED SAVED ITEMS =====
  console.log('💾 Creating saved items...');

  await Promise.all([
    prisma.savedCenter.create({
      data: {
        userId: user1.id,
        examCenterId: examCenters[0].id,
      },
    }),
    prisma.savedRoute.create({
      data: {
        userId: user2.id,
        travelRouteId: travelRoutes[1].id,
      },
    }),
    prisma.savedStay.create({
      data: {
        userId: user1.id,
        stayListingId: stayListings[1].id,
      },
    }),
  ]);

  console.log('✅ Created saved items');

  // ===== SEED COMMUNITY POSTS =====
  console.log('💬 Creating community posts...');

  const posts = await Promise.all([
    prisma.communityPost.create({
      data: {
        userId: user1.id,
        title: 'UPSC CSE 2024 - Success Tips',
        content:
          'Successfully cleared UPSC CSE 2024. Key tips: focus on NCERT books, consistent revision, and solving previous year papers. All the best!',
        tags: JSON.stringify(['UPSC', 'tips', 'success']),
        viewCount: 234,
      },
    }),
    prisma.communityPost.create({
      data: {
        userId: user2.id,
        title: 'Travel from Delhi to Mumbai for exam - Budget Tips',
        content:
          'Planning to travel from Delhi to Mumbai for exam? Train is cheaper than flight. I spent only ₹2500 on Rajdhani and saved on accommodation as well.',
        tags: JSON.stringify(['travel', 'budget', 'delhi-mumbai']),
        viewCount: 456,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} community posts`);

  // ===== SEED COMMENTS =====
  console.log('💭 Creating comments...');

  await Promise.all([
    prisma.comment.create({
      data: {
        userId: user2.id,
        communityPostId: posts[0].id,
        content: 'Thanks for the tips! Starting my prep now. Which coaching did you join?',
      },
    }),
    prisma.comment.create({
      data: {
        userId: user1.id,
        communityPostId: posts[1].id,
        content: 'Great suggestion! Can you share more about hostel options?',
      },
    }),
  ]);

  console.log('✅ Created comments');

  // ===== SEED JOURNEY PARTNERS =====
  console.log('👥 Creating journey partner profiles...');

  await Promise.all([
    prisma.journeyPartner.create({
      data: {
        userId: user1.id,
        matchCriteria: JSON.stringify({
          examType: 'UPSC CSE',
          travelLocation: 'Delhi',
          departureDate: '2024-06-15',
          preferencesSharing: 'full',
        }),
        isActive: true,
      },
    }),
    prisma.journeyPartner.create({
      data: {
        userId: user2.id,
        matchCriteria: JSON.stringify({
          examType: 'GATE',
          travelLocation: 'Bengaluru',
          departureDate: '2024-07-01',
          preferencesSharing: 'partial',
        }),
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created journey partner profiles');

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 4 (1 admin, 1 moderator, 2 regular)`);
  console.log(`   - Exam Centers: ${examCenters.length}`);
  console.log(`   - Travel Routes: ${travelRoutes.length}`);
  console.log(`   - Stay Listings: ${stayListings.length}`);
  console.log(`   - Reviews: ${reviews.length}`);
  console.log(`   - Community Posts: ${posts.length}`);
  console.log(`   - Comments: 2`);
  console.log(`   - Saved Items: 3`);
  console.log(`   - Journey Partners: 2`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
