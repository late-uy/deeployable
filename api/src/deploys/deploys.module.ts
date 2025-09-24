import { Module } from '@nestjs/common';
import { DeploysController } from './deploys.controller';
import { JobsService } from '../jobs/jobs.service';
import { DockerService } from '../docker/docker.service';

@Module({
  controllers: [DeploysController],
  providers: [JobsService, DockerService],
})
export class DeploysModule {}


