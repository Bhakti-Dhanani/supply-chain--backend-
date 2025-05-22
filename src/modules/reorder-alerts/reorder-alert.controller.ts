import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReorderAlertService } from './reorder-alert.service';

@Controller('reorder-alerts')
export class ReorderAlertController {
  constructor(private readonly reorderAlertService: ReorderAlertService) {}

  @Get()
  getAllReorderAlerts() {
    return this.reorderAlertService.getAllReorderAlerts();
  }

  @Post()
  setReorderAlert(@Body() setReorderAlertDto: any) {
    return this.reorderAlertService.setReorderAlert(setReorderAlertDto);
  }
}
