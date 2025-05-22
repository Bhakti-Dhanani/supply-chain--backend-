import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WarehouseManager])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
