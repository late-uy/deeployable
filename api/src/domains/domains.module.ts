import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller.js';
import { DomainsService } from './domains.service.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  controllers: [DomainsController],
  providers: [DomainsService, RolesGuard],
})
export class DomainsModule {}
