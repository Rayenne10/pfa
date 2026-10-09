import { jwtSecret } from '../config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from '../libs/guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret(),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
})
export class AuthModule {}
