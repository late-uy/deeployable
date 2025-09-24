import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterRootDto {
  email!: string;
  password!: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-root')
  registerRoot(@Body() body: RegisterRootDto) {
    return this.authService.registerRoot(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('has-users')
  hasUsers() {
    return this.authService.hasUsers();
  }
}


