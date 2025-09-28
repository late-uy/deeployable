import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserRole } from '@prisma/client';
import { UserEntity } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createRoot(email: string, passwordHash: string) {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.ROOT,
      },
    });
  }

  async hasUsers(): Promise<boolean> {
    const count = await this.prisma.user.count();
    return count > 0;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return user ?? null;
  }
}
