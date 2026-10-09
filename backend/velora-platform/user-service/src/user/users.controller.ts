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
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from 'src/guards/jwt.roles.guard';
import { Roles } from 'src/guards/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

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
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

}