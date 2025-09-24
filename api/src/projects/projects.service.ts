import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(id: number) {
    const p = await this.prisma.project.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }

  async create(data: CreateProjectDto) {
    return this.prisma.project.create({ data });
  }

  async update(id: number, data: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.project.delete({ where: { id } });
  }
}


