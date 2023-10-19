import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<object> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(pass, user.password_hash))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: `${process.env.JWT_SECRET}`,
      }),
    };
  }
}
