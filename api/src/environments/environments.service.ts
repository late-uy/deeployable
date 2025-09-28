import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from './dto.js';

@Injectable()
export class EnvironmentsService {
  constructor(private prisma: PrismaService) {}

  async ensureProject() {
    const project = await this.prisma.project.findFirst();
    if (!project) {
      throw new NotFoundException('Project not configured');
    }
    return project;
  }

  async list() {
    const project = await this.ensureProject();
    return this.prisma.environment.findMany({ where: { projectId: project.id } });
  }

  async create(dto: CreateEnvironmentDto) {
    const project = await this.ensureProject();
    return this.prisma.environment.create({
      data: {
        projectId: project.id,
        ...dto,
      },
    });
  }

  async update(id: number, dto: UpdateEnvironmentDto) {
    await this.ensureProject();
    return this.prisma.environment.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    await this.ensureProject();
    return this.prisma.environment.delete({ where: { id } });
  }
}
