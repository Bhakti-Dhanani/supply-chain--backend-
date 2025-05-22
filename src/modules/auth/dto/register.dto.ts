import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {UserRole } from  '../../users/user.entity'; // Adjust the import path as necessary

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  role: UserRole; // Use RoleName enum for role
}
