import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

interface QueueItem {
  id: number;
}

@Injectable()
export class DeploysService {
  private queue: QueueItem[] = [];
  private processing = false;

  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.deploy.findMany({ orderBy: { startedAt: 'desc' }, take: 50 });
  }

  async trigger(environmentId: number, sha?: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId },
      include: { project: true },
    });
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }

    const deploy = await this.prisma.deploy.create({
      data: {
        environmentId,
        projectId: environment.projectId,
        sha,
        status: 'queued',
      },
    });
    this.queue.push({ id: deploy.id });
    this.processQueue().catch(() => undefined);
    return deploy;
  }

  private async processQueue() {
    if (this.processing) {
      return;
    }
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) {
        break;
      }

      await this.prisma.deploy.update({
        where: { id: item.id },
        data: { status: 'running', startedAt: new Date() },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      await this.prisma.deploy.update({
        where: { id: item.id },
        data: { status: 'succeeded', finishedAt: new Date() },
      });
    }

    this.processing = false;
  }
}
