import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAllUsers() {
    return this.userRepository.find();
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  createUser(createUserDto: any) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  updateUser(id: number, updateUserDto: any) {
    return this.userRepository.update(id, updateUserDto);
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }
}
