import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { EnvironmentsService } from './environments.service.js';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from './dto.js';

@Controller('environments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EnvironmentsController {
  constructor(private environmentsService: EnvironmentsService) {}

  @Get()
  list() {
    return this.environmentsService.list();
  }

  @Post()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  create(@Body() dto: CreateEnvironmentDto) {
    return this.environmentsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnvironmentDto) {
    return this.environmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.environmentsService.delete(id);
  }
}
