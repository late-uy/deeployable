import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { VariablesService } from './variables.service.js';
import { CreateVariableDto, UpdateVariableDto } from './dto.js';

@Controller('variables')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VariablesController {
  constructor(private variablesService: VariablesService) {}

  @Get()
  list(@Query('environmentId', ParseIntPipe) environmentId: number) {
    return this.variablesService.list(environmentId);
  }

  @Post()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  create(@Body() dto: CreateVariableDto) {
    return this.variablesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariableDto) {
    return this.variablesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variablesService.remove(id);
  }
}
