import { InternalGuard } from '../guards/internal.guard';
import { UserUpdateGuard } from '../guards/user-update.guard';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { RolesGuard } from '../guards/jwt.roles.guard';
import { Roles } from '../guards/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(InternalGuard)
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(InternalGuard)
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
  
  @Get('/count')
countUsers() {
  return this.usersService.countUsers();
}
@UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    // req.user est injecté par JwtStrategy.validate
    const userId = req.user.sub; // le "sub" du token
    return this.usersService.findById(userId);
  }


  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }
  @UseGuards(UserUpdateGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto, @Req() req: any) {
    if (!req.internal && req.user.role !== 'ADMIN' && (Number(req.user.sub) !== Number(id) || body.role !== undefined || body.isVerified !== undefined)) throw new ForbiddenException();
    return this.usersService.update(id, body);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

}
