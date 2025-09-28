import { Injectable } from '@nestjs/common';
import { access } from 'fs/promises';
import { constants } from 'fs';
import { spawn } from 'child_process';

@Injectable()
export class DockerService {
  async isAvailable(): Promise<boolean> {
    const dockerPath = process.env.DOCKER_BIN ?? '/usr/bin/docker';
    try {
      await access(dockerPath, constants.X_OK);
      return true;
    } catch (error) {
      return await new Promise<boolean>((resolve) => {
        const which = spawn('which', ['docker']);
        which.on('exit', (code) => resolve(code === 0));
        which.on('error', () => resolve(false));
      });
    }
  }
}
