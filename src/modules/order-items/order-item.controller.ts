import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrderItemService } from './order-item.service';

@Controller('orders/:id/items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  getAllOrderItems(@Param('id') orderId: number) {
    return this.orderItemService.getAllOrderItems(orderId);
  }

  @Post()
  addOrderItem(@Param('id') orderId: number, @Body() addOrderItemDto: any) {
    return this.orderItemService.addOrderItem(orderId, addOrderItemDto);
  }
}
