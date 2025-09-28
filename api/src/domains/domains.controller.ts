import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { DomainsService } from './domains.service.js';
import { CreateDomainDto, VerifyDomainDto } from './dto.js';

@Controller('domains')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @Get()
  list(@Query('environmentId', ParseIntPipe) environmentId: number) {
    return this.domainsService.list(environmentId);
  }

  @Post()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  create(@Body() dto: CreateDomainDto) {
    return this.domainsService.create(dto);
  }

  @Post(':id/verify')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  verify(@Param('id', ParseIntPipe) id: number, @Body() dto: VerifyDomainDto) {
    return this.domainsService.markVerified(id, dto);
  }
}
