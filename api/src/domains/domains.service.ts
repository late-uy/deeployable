import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDomainDto, VerifyDomainDto } from './dto.js';
import { randomBytes } from 'crypto';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async list(environmentId: number) {
    return this.prisma.domain.findMany({ where: { environmentId } });
  }

  async create(dto: CreateDomainDto) {
    await this.ensureEnvironment(dto.environmentId);
    return this.prisma.domain.create({
      data: {
        environmentId: dto.environmentId,
        hostname: dto.hostname,
        verificationToken: randomBytes(16).toString('hex'),
      },
    });
  }

  async markVerified(id: number, dto: VerifyDomainDto) {
    const domain = await this.prisma.domain.findUnique({ where: { id } });
    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    return this.prisma.domain.update({
      where: { id },
      data: { verified: dto.verified },
    });
  }

  private async ensureEnvironment(environmentId: number) {
    const env = await this.prisma.environment.findUnique({ where: { id: environmentId } });
    if (!env) {
      throw new NotFoundException('Environment not found');
    }
    return env;
  }
}
