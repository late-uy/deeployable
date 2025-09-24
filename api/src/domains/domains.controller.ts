import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto';
import { Resolver } from 'dns/promises';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('domains')
export class DomainsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @Roles('root', 'admin')
  async create(@Body() body: CreateDomainDto) {
    // TODO: opcionalmente validar formato adicional
    return this.prisma.domain.create({ data: { projectId: body.projectId, host: body.host, type: body.type } });
  }

  @Get(':id/verify')
  @Roles('root', 'admin')
  async verify(@Param('id', ParseIntPipe) id: number) {
    const domain = await this.prisma.domain.findUnique({ where: { id } });
    if (!domain) throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);

    const resolver = new Resolver();
    let ok = false;
    try {
      const records = await resolver.resolveCname(domain.host);
      const expectedSuffix = (process.env.PUBLIC_SUBDOMAIN_SUFFIX || 'deeployable.localhost').toLowerCase();
      ok = records.some((c) => c.toLowerCase().includes(expectedSuffix));
    } catch {
      // Si no se puede resolver, dejamos ok=false
      ok = false;
    }

    if (ok) {
      await this.prisma.domain.update({ where: { id }, data: { verifiedAt: new Date() as any } });
    }
    return { ok, verifiedAt: ok ? new Date() : null };
  }
}


