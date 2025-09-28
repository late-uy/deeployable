import { Module } from '@nestjs/common';
import { EnvironmentsController } from './environments.controller.js';
import { EnvironmentsService } from './environments.service.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService, RolesGuard],
})
export class EnvironmentsModule {}
