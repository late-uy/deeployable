import { Injectable, Logger } from '@nestjs/common';
import { DockerService } from '../docker/docker.service';

export interface DeploymentJob {
  projectId: number;
  environmentId: number;
  sha: string;
  receivedAt: Date;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly queue: DeploymentJob[] = [];
  private isWorkerRunning = false;

  enqueue(job: Omit<DeploymentJob, 'receivedAt'>) {
    this.queue.push({ ...job, receivedAt: new Date() });
    this.runWorker();
  }

  private runWorker() {
    if (this.isWorkerRunning) return;
    this.isWorkerRunning = true;
    const processNext = () => {
      const next = this.queue.shift();
      if (!next) {
        this.isWorkerRunning = false;
        return;
      }
      try {
        this.logger.log(
          `Processing job: projectId=${next.projectId} envId=${next.environmentId} sha=${next.sha}`,
        );
        void this.docker.deploy({
          projectId: next.projectId,
          environmentId: next.environmentId,
          sha: next.sha,
        });
      } catch (err) {
        this.logger.error('Job failed', err as Error);
      } finally {
        // Procesar el siguiente en el próximo tick para no bloquear el loop
        setImmediate(processNext);
      }
    };
    setImmediate(processNext);
  }
  constructor(private readonly docker: DockerService) {}
}


