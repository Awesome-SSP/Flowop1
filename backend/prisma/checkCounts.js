const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const keys = Object.keys(prisma).filter(k => !k.startsWith('$'));
    console.log('Prisma model clients:', keys);

    for (const k of keys) {
      try {
        if (typeof prisma[k].count === 'function') {
          const c = await prisma[k].count();
          console.log(`${k}: ${c} rows`);
        } else {
          console.log(`${k}: no count() delegate`);
        }
      } catch (err) {
        console.log(`${k}: error counting ->`, err.message);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();