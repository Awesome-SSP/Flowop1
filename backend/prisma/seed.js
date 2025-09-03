const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const has = (n) => typeof prisma[n] === 'object';

async function main() {
  console.log('Available clients:', Object.keys(prisma).filter(k => !k.startsWith('$')));

  // Create business/firm roles
  let partnerRole = null;
  let associateRole = null;
  let analystRole = null;
  let adminRole = null;
  let clientRole = null;

  if (has('role')) {
    partnerRole = await prisma.role.upsert({
      where: { name: 'Partner' },
      update: {},
      create: { 
        id: 'partner-role-id',
        name: 'Partner', 
        description: 'Senior partner with full firm access and client management' 
      },
    });

    associateRole = await prisma.role.upsert({
      where: { name: 'Associate' },
      update: {},
      create: { 
        id: 'associate-role-id',
        name: 'Associate', 
        description: 'Mid-level professional with project management capabilities' 
      },
    });

    analystRole = await prisma.role.upsert({
      where: { name: 'Analyst' },
      update: {},
      create: { 
        id: 'analyst-role-id',
        name: 'Analyst', 
        description: 'Junior professional with research and analysis responsibilities' 
      },
    });

    adminRole = await prisma.role.upsert({
      where: { name: 'Administrator' },
      update: {},
      create: { 
        id: 'admin-role-id',
        name: 'Administrator', 
        description: 'System administrator with full technical access' 
      },
    });

    clientRole = await prisma.role.upsert({
      where: { name: 'Client' },
      update: {},
      create: { 
        id: 'client-role-id',
        name: 'Client', 
        description: 'External client with limited access to their projects' 
      },
    });

    console.log('Business roles created:', {
      partner: partnerRole.id,
      associate: associateRole.id,
      analyst: analystRole.id,
      admin: adminRole.id,
      client: clientRole.id
    });
  }

  // Create demo users with business context
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  if (has('usersignup')) {
    // Partner users
    const partner1 = await prisma.usersignup.upsert({
      where: { email: 'sarah.johnson@flowops.com' },
      update: {},
      create: {
        id: 'partner-1-id',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@flowops.com',
        password: hashedPassword,
      },
    });

    const partner2 = await prisma.usersignup.upsert({
      where: { email: 'michael.chen@flowops.com' },
      update: {},
      create: {
        id: 'partner-2-id',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@flowops.com',
        password: hashedPassword,
      },
    });

    // Associate users
    const associate1 = await prisma.usersignup.upsert({
      where: { email: 'jennifer.davis@flowops.com' },
      update: {},
      create: {
        id: 'associate-1-id',
        firstName: 'Jennifer',
        lastName: 'Davis',
        email: 'jennifer.davis@flowops.com',
        password: hashedPassword,
      },
    });

    const associate2 = await prisma.usersignup.upsert({
      where: { email: 'david.wilson@flowops.com' },
      update: {},
      create: {
        id: 'associate-2-id',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@flowops.com',
        password: hashedPassword,
      },
    });

    // Analyst users
    const analyst1 = await prisma.usersignup.upsert({
      where: { email: 'emily.martinez@flowops.com' },
      update: {},
      create: {
        id: 'analyst-1-id',
        firstName: 'Emily',
        lastName: 'Martinez',
        email: 'emily.martinez@flowops.com',
        password: hashedPassword,
      },
    });

    const analyst2 = await prisma.usersignup.upsert({
      where: { email: 'james.brown@flowops.com' },
      update: {},
      create: {
        id: 'analyst-2-id',
        firstName: 'James',
        lastName: 'Brown',
        email: 'james.brown@flowops.com',
        password: hashedPassword,
      },
    });

    // Admin user
    const adminUser = await prisma.usersignup.upsert({
      where: { email: 'admin@flowops.com' },
      update: {},
      create: {
        id: 'admin-user-id',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@flowops.com',
        password: hashedPassword,
      },
    });

    // Client users
    const client1 = await prisma.usersignup.upsert({
      where: { email: 'john.smith@clientcorp.com' },
      update: {},
      create: {
        id: 'client-1-id',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@clientcorp.com',
        password: hashedPassword,
      },
    });

    console.log('Business users created');

    // Assign roles to users
    if (has('userrole')) {
      const roleAssignments = [
        { userId: partner1.id, roleId: partnerRole.id, id: 'partner-1-role' },
        { userId: partner2.id, roleId: partnerRole.id, id: 'partner-2-role' },
        { userId: associate1.id, roleId: associateRole.id, id: 'associate-1-role' },
        { userId: associate2.id, roleId: associateRole.id, id: 'associate-2-role' },
        { userId: analyst1.id, roleId: analystRole.id, id: 'analyst-1-role' },
        { userId: analyst2.id, roleId: analystRole.id, id: 'analyst-2-role' },
        { userId: adminUser.id, roleId: adminRole.id, id: 'admin-user-role' },
        { userId: client1.id, roleId: clientRole.id, id: 'client-1-role' },
      ];

      for (const assignment of roleAssignments) {
        try {
          await prisma.userrole.create({
            data: assignment,
          });
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`Role assignment already exists for user ${assignment.userId}`);
          } else {
            throw error;
          }
        }
      }
      console.log('Role assignments completed');
    }
  }

  // Populate contacts with business context
  if (has('contact')) {
    await prisma.contact.createMany({
      data: [
        {
          id: 'contact-1-id',
          type: 'Client',
          firstName: 'Robert',
          lastName: 'Thompson',
          title: 'CEO',
          emailAddress: 'robert.thompson@techcorp.com',
          officeNumber: '555-0101',
          cellNumber: '555-0102',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          notes: 'Fortune 500 CEO, handles strategic decisions',
          group: 'Enterprise Clients',
          status: 'Active'
        },
        {
          id: 'contact-2-id',
          type: 'Prospect',
          firstName: 'Lisa',
          lastName: 'Anderson',
          title: 'CFO',
          emailAddress: 'lisa.anderson@financeplus.com',
          officeNumber: '555-0201',
          cellNumber: '555-0202',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
          notes: 'Interested in financial consulting services',
          group: 'Hot Prospects',
          status: 'Active'
        },
        {
          id: 'contact-3-id',
          type: 'Vendor',
          firstName: 'Mark',
          lastName: 'Rodriguez',
          title: 'Sales Director',
          emailAddress: 'mark.rodriguez@supplycorp.com',
          officeNumber: '555-0301',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          notes: 'Primary vendor for office supplies',
          group: 'Preferred Vendors',
          status: 'Active'
        },
        {
          id: 'contact-4-id',
          type: 'Partner',
          firstName: 'Amanda',
          lastName: 'White',
          title: 'Managing Partner',
          emailAddress: 'amanda.white@legalpartners.com',
          officeNumber: '555-0401',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          notes: 'Strategic legal partner for complex deals',
          group: 'Strategic Partners',
          status: 'Active'
        }
      ],
      skipDuplicates: true,
    });
    console.log('Business contacts created');
  }

  // Populate form submissions with business context
  if (has('userregisteration')) {
    await prisma.userregisteration.createMany({
      data: [
        {
          id: 'submission-1-id',
          type: 'Client Onboarding',
          firstName: 'Patricia',
          lastName: 'Wilson',
          email: 'patricia.wilson@newclient.com',
          phoneNo: '555-1001',
          role: 'Project Manager',
          userGroup: 'New Clients',
        },
        {
          id: 'submission-2-id',
          type: 'Service Request',
          firstName: 'Kevin',
          lastName: 'Lee',
          email: 'kevin.lee@existingclient.com',
          phoneNo: '555-1002',
          role: 'Operations Director',
          userGroup: 'Existing Clients',
        },
        {
          id: 'submission-3-id',
          type: 'Partnership Inquiry',
          firstName: 'Michelle',
          lastName: 'Garcia',
          email: 'michelle.garcia@potentialpartner.com',
          phoneNo: '555-1003',
          role: 'Business Development',
          userGroup: 'Potential Partners',
        }
      ],
      skipDuplicates: true,
    });
    console.log('Business form submissions created');
  }

  console.log('✅ Business/firm seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- 5 business roles (Partner, Associate, Analyst, Administrator, Client)');
  console.log('- 8 users across different firm levels');
  console.log('- 4 business contacts (clients, prospects, vendors, partners)');
  console.log('- 3 form submissions (onboarding, service requests, partnerships)');
  console.log('\n🔑 Login credentials: any_email@flowops.com / Password123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });