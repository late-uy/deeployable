import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

class RequestDto {
  domain!: string;
  email?: string;
  challenge!: 'http-01' | 'dns-01';
}

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certs: CertificatesService) {}

  @Post('request')
  async request(@Body() body: RequestDto) {
    if (!body?.domain || !body?.challenge) {
      throw new HttpException('domain and challenge required', HttpStatus.BAD_REQUEST);
    }
    return this.certs.requestCertificate({ domain: body.domain, email: body.email, challenge: body.challenge });
  }

  @Get(':domain/status')
  async status(@Param('domain') domain: string) {
    return this.certs.getStatus(domain);
  }
}


