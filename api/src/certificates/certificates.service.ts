import { Injectable, Logger } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as http from 'node:http';
import * as https from 'node:https';

type ChallengeType = 'http-01' | 'dns-01';

export interface CertificateRequest {
  domain: string;
  email?: string;
  challenge: ChallengeType;
}

export interface CertificateStatus {
  domain: string;
  issued: boolean;
  expiresAt?: string;
  resolver?: string;
}

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);
  private readonly cache = new Map<string, { resolver: string; requestedAt: number }>();

  async requestCertificate(req: CertificateRequest): Promise<{ ok: true; resolver: string }>{
    const resolver = req.challenge === 'dns-01' ? (process.env.TRAEFIK_RESOLVER_CF || 'cf') : (process.env.TRAEFIK_RESOLVER_HTTP || 'le_http');
    const dynamicDir = process.env.TRAEFIK_DYNAMIC_PATH || '/etc/traefik/dynamic';

    const slug = this.slug(req.domain);
    const filePath = join(dynamicDir, `cert-${slug}.yml`);
    const yaml = this.buildDynamicYaml(req.domain, resolver);
    await mkdir(dynamicDir, { recursive: true });
    await writeFile(filePath, yaml, 'utf8');

    this.cache.set(req.domain, { resolver, requestedAt: Date.now() });
    this.logger.log(`Wrote Traefik dynamic config for ${req.domain} at ${filePath} (resolver=${resolver})`);
    return { ok: true, resolver };
  }

  async getStatus(domain: string): Promise<CertificateStatus> {
    // Try Traefik API
    const apiBase = process.env.TRAEFIK_API_URL || 'http://localhost:8080';
    try {
      const data = await this.fetchJson(`${apiBase}/api/tls/certificates`);
      const cert = Array.isArray(data)
        ? data.find((c: any) => Array.isArray(c?.domains) && c.domains.includes(domain))
        : undefined;
      if (cert) {
        return {
          domain,
          issued: true,
          expiresAt: cert?.notAfter || undefined,
          resolver: this.cache.get(domain)?.resolver,
        };
      }
    } catch (err) {
      this.logger.warn(`Traefik API not reachable for status: ${String(err)}`);
    }
    return {
      domain,
      issued: false,
      resolver: this.cache.get(domain)?.resolver,
    };
  }

  private buildDynamicYaml(domain: string, resolver: string): string {
    // Minimal dynamic config: router for domain with TLS resolver and a noop service
    // Entrypoints assumed: web, websecure
    return [
      'http:',
      '  routers:',
      `    cert-${this.slug(domain)}:`,
      `      rule: "Host(\`${domain}\`)"`,
      '      entryPoints:',
      '        - web',
      '        - websecure',
      '      tls:',
      `        certResolver: ${resolver}`,
      '      service: noop',
      '  services:',
      '    noop:',
      '      loadBalancer:',
      '        servers:',
      '          - url: "http://127.0.0.1:65535"',
      ''
    ].join('\n');
  }

  private slug(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  private fetchJson(urlStr: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const lib = urlStr.startsWith('https') ? https : http;
      const req = lib.get(urlStr, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
          } catch (err) {
            reject(err);
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(3000, () => {
        req.destroy(new Error('timeout'));
      });
    });
  }
}


