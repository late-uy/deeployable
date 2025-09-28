#!/usr/bin/env node
import { spawn } from 'child_process';

const start = spawn('next', ['start', '--port', process.env.PORT || '8080'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

start.on('exit', (code) => process.exit(code ?? 0));
