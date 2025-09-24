import { Body, Controller, Headers, Post } from '@nestjs/common';
import * as crypto from 'crypto';
import { JobsService } from '../jobs/jobs.service';

interface GithubWebhookBody {
  repository?: { full_name?: string };
  after?: string; // commit SHA
  // ...other fields not strictly needed here
}

@Controller('hooks')
export class HooksController {
  constructor(private readonly jobs: JobsService) {}

  @Post('github')
  github(
    @Body() body: GithubWebhookBody,
    @Headers('x-hub-signature-256') signature256: string | undefined,
  ) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
    if (!this.verifySignature(secret, body, signature256)) {
      return { ok: false };
    }

    const sha = body.after || '';
    // Placeholder: resolver projectId/envId desde el repo o headers personalizados
    const projectId = Number(process.env.DEFAULT_PROJECT_ID || 1);
    const environmentId = Number(process.env.DEFAULT_ENVIRONMENT_ID || 1);
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


