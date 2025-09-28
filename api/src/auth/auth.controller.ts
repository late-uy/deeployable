import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('has-users')
  async hasUsers() {
    const hasUsers = await this.authService.hasUsers();
    return { hasUsers };
  }

  @Post('register-root')
  async registerRoot(@Body() body: LoginDto) {
    return this.authService.registerRoot(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
