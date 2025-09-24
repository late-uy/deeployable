import { Module } from '@nestjs/common';
import { HooksController } from './hooks.controller';
import { JobsService } from '../jobs/jobs.service';
import { DockerService } from '../docker/docker.service';

@Module({
  controllers: [HooksController],
  providers: [JobsService, DockerService],
})
export class HooksModule {}


