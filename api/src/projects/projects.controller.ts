import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto, UpdateProjectDto } from './dto.js';

@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async getProject() {
    return this.projectsService.getProject();
  }

  @Post()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Patch()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async update(@Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(dto);
  }
}
