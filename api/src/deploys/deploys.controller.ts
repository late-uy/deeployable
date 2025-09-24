import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { DockerService } from '../docker/docker.service';

class CreateDeployDto {
  environmentId!: number;
  sha?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:projectId/deploys')
export class DeploysController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobs: JobsService,
    private readonly docker: DockerService,
  ) {}

  @Get()
  async list(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.prisma.deploy.findMany({
      where: { projectId },
      orderBy: { id: 'desc' },
      take: 50,
    });
  }

  @Post()
  @Roles('root', 'admin')
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateDeployDto,
  ) {
    const { environmentId, sha } = body;
    const dockerAvailable = await this.docker.isDockerAvailable();
    if (!dockerAvailable) {
      throw new HttpException('docker no instalado', HttpStatus.SERVICE_UNAVAILABLE);
    }
    this.jobs.enqueue({ projectId, environmentId, sha: sha || '' });
    return { ok: true };
  }
}


