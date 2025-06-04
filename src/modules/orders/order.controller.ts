import { Body, Controller, Post, Get, Put, Delete, Param, UnauthorizedException, UseGuards, Query } from '@nestjs/common';
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

  @Get('my')
  async getMyOrders(@User() user: UserEntity) {
    return this.orderService.getOrdersByVendor(user.id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return await this.orderService.getOrderById(id);
  }

  @Put(':id')
  updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatusDto: any) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  cancelOrder(@Param('id') id: number) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id/delete')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Get()
  async getOrders(@Query('warehouseIds') warehouseIds?: string, @User() user?: UserEntity) {
    if (warehouseIds) {
      // warehouseIds is a comma-separated string of IDs
      const ids = warehouseIds.split(',').map((id) => Number(id)).filter(Boolean);
      return this.orderService.getOrdersByWarehouseIds(ids); // Pass only warehouseIds
    }
    // fallback: return all orders (or restrict as needed)
    return [];
  }
}
