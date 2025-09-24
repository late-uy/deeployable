import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    if (count > 0) {
      console.log('Users already exist, skipping root bootstrap');
      return;
    }
    const email = process.env.ROOT_EMAIL;
    const password = process.env.ROOT_PASSWORD;
    if (!email || !password) {
      console.log('ROOT_EMAIL/ROOT_PASSWORD not provided, skipping root bootstrap');
      return;
    }
    const passwordHash = await argon2.hash(password);
    await prisma.user.create({ data: { email, passwordHash, role: 'root' } });
    console.log('Root user created');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


