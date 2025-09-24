import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import * as http from 'node:http';

const pexec = promisify(exec);

export interface DeployRequest {
  projectId: number;
  environmentId: number;
  sha: string;
}

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);

  async isDockerAvailable(): Promise<boolean> {
    try {
      await pexec('docker -v');
      return true;
    } catch {
      return false;
    }
  }

  async deploy(req: DeployRequest): Promise<{ status: 'success' | 'failed'; message?: string }>
  {
    const hasDocker = await this.isDockerAvailable();
    if (!hasDocker) {
      const message = 'docker no instalado';
      this.logger.warn(message);
      throw new Error(message);
    }

    // Read project/environment
    const project = await this.prisma.project.findUnique({ where: { id: req.projectId } });
    const environment = await this.prisma.environment.findUnique({ where: { id: req.environmentId } });
    if (!project || !environment) {
      throw new Error('Proyecto o Environment inexistente');
    }

    const startedAt = new Date();
    const deploy = await this.prisma.deploy.create({
      data: {
        project: { connect: { id: project.id } },
        environment: { connect: { id: environment.id } },
        sha: req.sha,
        status: 'running',
        startedAt,
        logsPtr: '',
      },
    });

    const workdir = await mkdtemp(join(tmpdir(), 'deeployable-'));
    const imageTag = `deeployable/${this.slug(project.name)}-${this.slug(environment.name)}:${req.sha}`;
    let containerId = '';
    try {
      // Clone repository
      await this.ensureGitAvailable();
      await pexec(`git clone --depth 1 --branch ${this.shellEscape(project.branch)} ${this.shellEscape(project.repoUrl)} repo`, { cwd: workdir });
      // Checkout SHA if provided
      if (req.sha) {
        await pexec(`git fetch origin ${this.shellEscape(req.sha)} --depth 1`, { cwd: join(workdir, 'repo') });
        await pexec(`git checkout ${this.shellEscape(req.sha)}`, { cwd: join(workdir, 'repo') });
      }

      // Build docker image
      await pexec(`docker build -t ${imageTag} .`, { cwd: join(workdir, 'repo') });

      // Run container on random host port mapping to project.runtimePort
      // Using -p <containerPort> maps to random host port.
      const runResult = await pexec(`docker run -d -p ${project.runtimePort} ${imageTag}`);
      containerId = runResult.stdout.trim();

      // Inspect to get host port
      const inspect = await pexec(`docker inspect ${containerId} --format='{{json .NetworkSettings.Ports}}'`);
      const portsJson = inspect.stdout.trim().replace(/^'|'^/g, '').replace(/^"|"$/g, '');
      const ports = JSON.parse(portsJson) as Record<string, Array<{ HostIp: string; HostPort: string }>>;
      const portKey = `${project.runtimePort}/tcp`;
      const hostPort = ports[portKey]?.[0]?.HostPort;
      if (!hostPort) throw new Error('No se pudo obtener el puerto publicado');

      // Health check
      const healthy = await this.waitForHealthy(Number(hostPort));
      if (!healthy) {
        throw new Error('Health-check falló');
      }

      // Switch blue/green (activeSlot a/b)
      const envCurrent = await this.prisma.environment.findUnique({ where: { id: environment.id } });
      const nextSlot = (envCurrent && (envCurrent as any).activeSlot === 'a') ? 'b' : 'a';
      await this.prisma.environment.update({ where: { id: environment.id }, data: { activeSlot: nextSlot as any } });

      await this.prisma.deploy.update({
        where: { id: deploy.id },
        data: { status: 'success', finishedAt: new Date() as any, logsPtr: containerId },
      });
      return { status: 'success' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Deploy failed: ${message}`);
      await this.prisma.deploy.update({
        where: { id: deploy.id },
        data: { status: 'failed', finishedAt: new Date() as any, logsPtr: containerId || '' },
      });
      throw new Error(message);
    } finally {
      try { await rm(workdir, { recursive: true, force: true }); } catch {}
    }
  }

  private async ensureGitAvailable(): Promise<void> {
    try { await pexec('git --version'); } catch { throw new Error('git no instalado'); }
  }

  private waitForHealthy(port: number): Promise<boolean> {
    const attempts = 30;
    const delayMs = 1000;
    const tryOnce = (): Promise<boolean> => new Promise((resolve) => {
      const paths = ['/health', '/'];
      let done = false;
      const tryPath = (idx: number) => {
        if (idx >= paths.length) return resolve(false);
        const req = http.get({ hostname: '127.0.0.1', port, path: paths[idx], timeout: 1500 }, (res) => {
          if (!done && res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
            done = true; resolve(true);
          } else {
            res.resume();
            if (!done) tryPath(idx + 1);
          }
        });
        req.on('error', () => { if (!done) tryPath(idx + 1); });
        req.on('timeout', () => { req.destroy(); if (!done) tryPath(idx + 1); });
      };
      tryPath(0);
    });
    const loop = async () => {
      for (let i = 0; i < attempts; i++) {
        if (await tryOnce()) return true;
        await new Promise((r) => setTimeout(r, delayMs));
      }
      return false;
    };
    return loop();
  }

  private slug(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  private shellEscape(text: string): string {
    return `'${text.replace(/'/g, `'\''`)}'`;
  }

  constructor(private readonly prisma: PrismaService) {}
}


