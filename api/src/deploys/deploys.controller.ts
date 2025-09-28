import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeploysService } from './deploys.service.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class TriggerDeployDto {
  @Type(() => Number)
  @IsInt()
  environmentId!: number;

  @IsOptional()
  @IsString()
  sha?: string;
}

@Controller('deploys')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeploysController {
  constructor(private deploysService: DeploysService) {}

  @Get()
  list() {
    return this.deploysService.list();
  }

  @Post()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  trigger(@Body() dto: TriggerDeployDto) {
    return this.deploysService.trigger(dto.environmentId, dto.sha);
  }
}
