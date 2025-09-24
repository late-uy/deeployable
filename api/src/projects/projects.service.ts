import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

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
    const createData = {
      name: data.name,
      provider: data.provider ?? 'generic',
      repoUrl: data.repoUrl,
      branch: data.branch,
      buildCmd: data.buildCmd,
      startCmd: data.startCmd,
      runtimePort: data.runtimePort,
    };
    return this.prisma.project.create({ data: createData });
  }

  async update(id: number, data: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.project.delete({ where: { id } });
  }
}


