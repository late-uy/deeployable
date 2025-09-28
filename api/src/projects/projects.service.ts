import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto, UpdateProjectDto } from './dto.js';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getProject() {
    return this.prisma.project.findFirst();
  }

  async createProject(dto: CreateProjectDto) {
    const existing = await this.getProject();
    if (existing) {
      throw new BadRequestException('Project already exists');
    }

    return this.prisma.project.create({ data: dto });
  }

  async updateProject(dto: UpdateProjectDto) {
    const project = await this.getProject();
    if (!project) {
      throw new NotFoundException('No project configured');
    }

    return this.prisma.project.update({ where: { id: project.id }, data: dto });
  }
}
