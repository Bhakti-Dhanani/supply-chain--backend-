import { Body, Controller, Post, Get, Put, Delete, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { User } from '../../common/decorators/user.decorator';
import { User as UserEntity } from '../users/user.entity';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @User() user: UserEntity,
    @Body() createOrderDto: {
      warehouseId: number;
      items: { productId: number; quantity: number }[];
      house: string;
      street: string;
      city: string;
      state: string;
      country: string;
    }
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not found in request. Make sure authentication is enabled and @User() decorator is working.');
    }
    return this.orderService.createOrder(user, createOrderDto);
  }

  @Get(':id')
  getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatusDto: any) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  cancelOrder(@Param('id') id: number) {
    return this.orderService.cancelOrder(id);
  }
}
