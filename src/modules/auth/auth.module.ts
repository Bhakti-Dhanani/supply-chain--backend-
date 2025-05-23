import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { VendorModule } from '../vendors/vendor.module'; // Import VendorModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { WarehouseModule } from '../warehouses/warehouse.module'; // Import WarehouseModule

@Module({
  imports: [
    PassportModule,
    UserModule, // Import UserModule to provide UserRepository
    VendorModule, // Import VendorModule to provide VendorRepository
    TypeOrmModule.forFeature([WarehouseManager]), // Register WarehouseManager repository
    WarehouseModule, // Import WarehouseModule to provide WarehouseRepository
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
