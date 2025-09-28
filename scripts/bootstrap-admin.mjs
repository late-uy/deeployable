import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log('Usuarios existentes detectados. No se crea administrador.');
    return;
  }

  const email = 'admin@deeployable.local';
  const password = Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole.ROOT,
    },
  });

  console.log('==============================');
  console.log('Credenciales iniciales Deeployable');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('==============================');
}

main()
  .catch((error) => {
    console.error('No se pudo crear el administrador inicial:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
