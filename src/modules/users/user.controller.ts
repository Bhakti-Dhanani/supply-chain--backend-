import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('Admin')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @Roles('Admin')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @Roles('Admin')
  createUser(@Body() createUserDto: any) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @Roles('Admin')
  updateUser(@Param('id') id: number, @Body() updateUserDto: any) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('Admin')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
