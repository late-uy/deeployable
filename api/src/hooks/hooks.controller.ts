import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import * as crypto from 'crypto';
import { JobsService } from '../jobs/jobs.service';
import { PrismaService } from '../prisma/prisma.service';

interface GithubWebhookBody {
  repository?: { full_name?: string };
  after?: string; // commit SHA
  // ...other fields not strictly needed here
}

@Controller('hooks')
export class HooksController {
  constructor(private readonly jobs: JobsService, private readonly prisma: PrismaService) {}

  @Post('github')
  async github(
    @Body() body: GithubWebhookBody,
    @Headers('x-hub-signature-256') signature256: string | undefined,
    @Headers('x-project-id') projectIdHeader: string | undefined,
    @Headers('x-environment-id') envIdHeader: string | undefined,
  ) {
    const projectId = Number(projectIdHeader);
    const environmentId = Number(envIdHeader);
    if (!projectId || !environmentId) {
      throw new HttpException('Missing x-project-id / x-environment-id', HttpStatus.BAD_REQUEST);
    }
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project || !project.webhookSecret) {
      throw new HttpException('Project or webhookSecret not found', HttpStatus.NOT_FOUND);
    }
    if (!this.verifySignature(project.webhookSecret, body, signature256)) {
      throw new HttpException('Invalid signature', HttpStatus.FORBIDDEN);
    }

    const sha = body.after || '';
    this.jobs.enqueue({ projectId, environmentId, sha });
    return { ok: true };
  }

  private verifySignature(secret: string, body: unknown, signature256?: string): boolean {
    if (!secret) return false;
    if (!signature256 || !signature256.startsWith('sha256=')) return false;
    const payload = JSON.stringify(body);
    const computed =
      'sha256=' + crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(signature256), Buffer.from(computed));
    } catch {
      return false;
    }
  }
}


