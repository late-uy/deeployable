import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVariableDto, UpdateVariableDto } from './dto.js';

@Injectable()
export class VariablesService {
  constructor(private prisma: PrismaService) {}

  async list(environmentId: number) {
    return this.prisma.variable.findMany({
      where: { environmentId },
      select: { id: true, key: true, isSecret: true, environmentId: true },
    });
  }

  async create(dto: CreateVariableDto) {
    await this.ensureEnvironment(dto.environmentId);
    return this.prisma.variable.create({ data: dto });
  }

  async update(id: number, dto: UpdateVariableDto) {
    const variable = await this.prisma.variable.findUnique({ where: { id } });
    if (!variable) {
      throw new NotFoundException('Variable not found');
    }

    return this.prisma.variable.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.variable.delete({ where: { id } });
  }

  private async ensureEnvironment(environmentId: number) {
    const env = await this.prisma.environment.findUnique({ where: { id: environmentId } });
    if (!env) {
      throw new NotFoundException('Environment not found');
    }
    return env;
  }
}
