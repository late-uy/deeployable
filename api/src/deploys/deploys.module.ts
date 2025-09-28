import { Module } from '@nestjs/common';
import { DeploysController } from './deploys.controller.js';
import { DeploysService } from './deploys.service.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  controllers: [DeploysController],
  providers: [DeploysService, RolesGuard],
  exports: [DeploysService],
})
export class DeploysModule {}
