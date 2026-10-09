import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
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

    const hashed = await bcrypt.hash(password, 10);

    try {
      const response = await axios.post('http://localhost:3001/users', {
        email,
        password: hashed,
        firstName: registerDto.firstName,
  lastName: registerDto.lastName,
        role: 'USER',
        isVerified: true,
      });

      const token = this.jwtService.sign({ sub: response.data.id });

      return {
        message: 'User created, verify email',
        verify_token: token,
        verify_link: `http://localhost:3002/auth/verify/${token}`,
      };
    } catch (error) {
      throw new ConflictException('User already exists');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    let user;

    try {
      const response = await axios.get(
        `http://localhost:3001/users/email/${email}`,
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

  async requestReset(email: string) {
    let user;

    try {
      const response = await axios.get(
        `http://localhost:3001/users/email/${email}`,
      );
      user = response.data;
    } catch {
      throw new UnauthorizedException('User not found');
    }

    const token = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '15m' },
    );

    return {
      message: 'Reset token generated',
      reset_token: token,
      reset_link: `http://localhost:3002/auth/reset-password`,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    let decoded;

    try {
      decoded = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await axios.patch(
      `http://localhost:3001/users/${decoded.sub}`,
      { password: hashed },
    );

    return { message: 'Password updated' };
  }

  async verifyEmail(token: string) {
    let decoded;

    try {
      decoded = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid token');
    }

    await axios.patch(
      `http://localhost:3001/users/${decoded.sub}`,
      { isVerified: true },
    );

    return { message: 'Email verified successfully' };
  }

 
  async assignRole(userId: number, role: string) {
    await axios.patch(
      `http://localhost:3001/users/${userId}`,
      { role },
    );

    return { message: 'Role updated' };
  }
}