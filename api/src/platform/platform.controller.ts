import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DockerService } from '../docker/docker.service.js';

@Controller('platform')
export class PlatformController {
  constructor(private prisma: PrismaService, private dockerService: DockerService) {}

  @Get('health')
  async health() {
    const db = await this.prisma
      .$queryRaw`SELECT 1`
      .then(() => true)
      .catch(() => false);

    const docker = await this.dockerService.isAvailable();

    return { db, docker };
  }
}
