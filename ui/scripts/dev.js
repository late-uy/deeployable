#!/usr/bin/env node
import { spawn } from 'child_process';

const dev = spawn('next', ['dev', '--port', process.env.PORT || '8080'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

dev.on('exit', (code) => process.exit(code ?? 0));
