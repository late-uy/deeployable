import { Module } from '@nestjs/common';
import { PlatformController } from './platform.controller.js';
import { DockerService } from '../docker/docker.service.js';

@Module({
  controllers: [PlatformController],
  providers: [DockerService],
})
export class PlatformModule {}
