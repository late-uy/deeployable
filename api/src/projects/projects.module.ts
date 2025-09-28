import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { ProjectsController } from './projects.controller.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, RolesGuard],
})
export class ProjectsModule {}
