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
    if (!process.env.SEED_ADMIN_PASSWORD) return;
    const admin = await this.repo.findOne({
      where: { email: process.env.SEED_ADMIN_EMAIL || 'admin@example.test' },
    });

    if (!admin) {
      const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);

      const newAdmin = this.repo.create({
        email: process.env.SEED_ADMIN_EMAIL || 'admin@example.test',
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

    const user = this.repo.create({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 12),
       firstName: dto.firstName,
    lastName: dto.lastName,
      role: dto.role ?? Role.USER,
      isVerified: true,
    });

    const saved = await this.repo.save(user);
    const { password: _password, ...safe } = saved;
    return safe;
  }

  async findAll() {
    const users = await this.repo.find({where: { role: Role.USER }});
    return users.map(({ password: _password, ...safe }) => safe);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    const { password: _password, ...safe } = user;
    return safe;
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
