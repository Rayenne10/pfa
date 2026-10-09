import { Controller, Post, Body, Get, UseGuards,Patch,Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from 'src/libs/Decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminRoute() {
    return { message: 'Access granted: ADMIN' };
  }
  @Post('logout')
logout() {
  return this.authService.logout();
}

@Post('request-reset')
requestReset(@Body('email') email: string) {
  return this.authService.requestReset(email);
}

@Post('reset-password')
resetPassword(@Body() body: { token: string; password: string }) {
  return this.authService.resetPassword(body.token, body.password);
}

@Get('verify/:token')
verify(@Param('token') token: string) {
  return this.authService.verifyEmail(token);
}

@Patch('role')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
assignRole(@Body() body: { userId: number; role: string }) {
  return this.authService.assignRole(body.userId, body.role);
}
}