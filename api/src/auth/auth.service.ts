import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async registerRoot(email: string, password: string) {
    if (await this.usersService.count() > 0) {
      throw new BadRequestException('Root already exists');
    }
    const passwordHash = await argon2.hash(password);
    const user = await this.usersService.createUser(email, passwordHash, 'root');
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.jwtService.signAsync({ sub: user.id, role: user.role, email: user.email });
    return { access_token: token };
  }

  async hasUsers(): Promise<{ hasUsers: boolean }> {
    const count = await this.usersService.count();
    return { hasUsers: count > 0 };
  }
}


