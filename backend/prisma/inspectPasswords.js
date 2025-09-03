const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function inspect(email, testPlain = 'Password123!') {
  try {
    const user = await prisma.usersignup.findUnique({ where: { email } });
    if (!user) return console.log(email, 'not found');
    console.log('User:', email, 'id:', user.id);
    console.log('Stored password:', user.password);
    const matchesTest = await bcrypt.compare(testPlain, user.password);
    console.log(`bcrypt.compare(testPlain="${testPlain}") =>`, matchesTest);
    const matchesLoginValue = await bcrypt.compare('hashedpassword', user.password);
    console.log(`bcrypt.compare("hashedpassword") =>`, matchesLoginValue);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  await inspect('john.smith@clientcorp.com');
  await inspect('meow@gmail.com');
})();