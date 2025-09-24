import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from './environment.entity';

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.environment.findMany();
  }

  async findOne(id: number) {
    const env = await this.prisma.environment.findUnique({ where: { id } });
    if (!env) throw new NotFoundException('Environment not found');
    return env;
  }

  async create(data: CreateEnvironmentDto) {
    return this.prisma.environment.create({ data: { ...data, envVars: data.envVars as any } });
  }

  async update(id: number, data: UpdateEnvironmentDto) {
    return this.prisma.environment.update({ where: { id }, data: { ...data, envVars: data.envVars as any } });
  }

  async remove(id: number) {
    await this.prisma.environment.delete({ where: { id } });
  }
}


