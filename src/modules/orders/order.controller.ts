import { Body, Controller, Post, Get, Put, Delete, Param } from '@nestjs/common';
import { OrderService } from './order.service';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: { vendorId: number; items: { productId: number; quantity: number }[] }) {
    return this.orderService.createOrder(createOrderDto);
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
