import { Module } from '@nestjs/common';
import { HooksController } from './hooks.controller.js';
import { DeploysModule } from '../deploys/deploys.module.js';

@Module({
  imports: [DeploysModule],
  controllers: [HooksController],
})
export class HooksModule {}
