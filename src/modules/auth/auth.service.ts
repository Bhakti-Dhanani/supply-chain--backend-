import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { name, email, password, role } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await this.userRepository.save(user);

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { username: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token, userId: user.id, role: user.role, name: user.name };
  }
}
