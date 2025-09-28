import { Body, Controller, Post } from '@nestjs/common';
import { DeploysService } from '../deploys/deploys.service.js';

@Controller('hooks')
export class HooksController {
  constructor(private deploysService: DeploysService) {}

  @Post('github')
  async handleGithub(@Body() body: any) {
    const environmentId = body?.environmentId;
    const sha = body?.sha;
    if (typeof environmentId === 'number') {
      await this.deploysService.trigger(environmentId, sha);
    }
    return { received: true };
  }
}
