const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkLoginData() {
  try {
    // Check all users
    const users = await prisma.usersignup.findMany();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`);
    });

    // Test password hash
    const testUser = await prisma.usersignup.findUnique({ 
      where: { email: 'admin@flowops.com' } 
    });
    
    if (testUser) {
      console.log('\nTesting password for admin@flowops.com:');
      console.log('Stored hash:', testUser.password);
      
      const isValid = await bcrypt.compare('Password123!', testUser.password);
      console.log('Password "Password123!" is valid:', isValid);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLoginData();