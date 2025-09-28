import { Module } from '@nestjs/common';
import { VariablesController } from './variables.controller.js';
import { VariablesService } from './variables.service.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  controllers: [VariablesController],
  providers: [VariablesService, RolesGuard],
})
export class VariablesModule {}
