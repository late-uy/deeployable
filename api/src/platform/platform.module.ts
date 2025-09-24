import { Module } from '@nestjs/common';
import { PlatformController } from './platform.controller';
import { DockerService } from '../docker/docker.service';

@Module({
  controllers: [PlatformController],
  providers: [DockerService],
})
export class PlatformModule {}


