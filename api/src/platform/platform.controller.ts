import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DockerService } from '../docker/docker.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly prisma: PrismaService, private readonly docker: DockerService) {}

  @Get('health')
  async health() {
    let db = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = true;
    } catch {
      db = false;
    }
    const docker = await this.docker.isDockerAvailable();
    return { db, docker };
  }
}


