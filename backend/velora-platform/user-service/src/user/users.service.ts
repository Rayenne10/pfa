import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async onModuleInit() {
    const admin = await this.repo.findOne({
      where: { email: 'admin@velora.com' },
    });

    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);

      const newAdmin = this.repo.create({
        email: 'admin@velora.com',
        password: hashed,
        role: Role.ADMIN,
        isVerified: true,
        firstName: 'Admin',
  lastName: 'Velora',
      });

      await this.repo.save(newAdmin);
      console.log('Admin created');
    }
  }

  async create(dto: CreateUserDto) {
    console.log("DTO RECEIVED:", dto);
    const user = this.repo.create({
      email: dto.email,
      password: dto.password,
       firstName: dto.firstName,
    lastName: dto.lastName,
      role: dto.role ?? Role.USER,
      isVerified: true,
    });

    return this.repo.save(user);
  }

  async findAll() {
    return this.repo.find({where: { role: Role.USER }});
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.repo.update(id, dto);
    return { message: 'User updated' };
  }

  async delete(id: number) {
    await this.repo.delete(id);
    return { message: 'User deleted' };
  }
  async countUsers() {
  return this.repo.count();
}
}