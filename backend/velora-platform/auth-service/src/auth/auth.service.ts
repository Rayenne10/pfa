import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;



    try {
      const response = await axios.post(`${process.env.USER_SERVICE_URL || 'http://user-service:3000'}/users`, {
        email,
        password,
        firstName: registerDto.firstName,
  lastName: registerDto.lastName,
        role: 'USER',
        isVerified: true,
      });

      return { message: 'User created for the local demo', user: response.data };
    } catch (error) {
      throw new ConflictException('User already exists');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    let user;

    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL || 'http://user-service:3000'}/users/email/${email}`,
      );
      user = response.data;
    } catch {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
        user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    };
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }

  // No email transport is configured. Never return an account-reset token to a caller.
  async requestReset(_email: string) {
    throw new ServiceUnavailableException('Password reset requires a verified email delivery integration');
  }
  async resetPassword(_token: string, _newPassword: string) {
    throw new ServiceUnavailableException('Password reset is disabled in this demo');
  }
  async verifyEmail(_token: string) {
    throw new ServiceUnavailableException('Email verification is not configured in this demo');
  }

  async assignRole(userId: number, role: string) {
    await axios.patch(
      `${process.env.USER_SERVICE_URL || 'http://user-service:3000'}/users/${userId}`,
      { role },
    );

    return { message: 'Role updated' };
  }
}
