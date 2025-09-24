import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from './dto';
import { EnvironmentsService } from './environments.service';
import { JwtAuthGuard, RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Get()
  findAll() {
    return this.environmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.environmentsService.findOne(id);
  }

  @Post()
  @Roles('root', 'admin')
  create(@Body() body: CreateEnvironmentDto) {
    return this.environmentsService.create(body);
  }

  @Patch(':id')
  @Roles('root', 'admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateEnvironmentDto) {
    return this.environmentsService.update(id, body);
  }

  @Delete(':id')
  @Roles('root', 'admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.environmentsService.remove(id);
    return { ok: true };
  }
}


