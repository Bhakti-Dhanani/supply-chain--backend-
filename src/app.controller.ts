import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  @Get()
  @Roles('Admin', 'Vendor', 'Transporter', 'Manager')
  getDashboardData(@Req() req: any) {
    const userRole = req.user.role;

    switch (userRole) {
      case 'Admin':
        return {
          totalOrders: 102,
          totalVendors: 24,
          pendingApprovals: 5,
          inventoryAlerts: [
            { productId: 101, productName: 'Product A', stock: 2 },
          ],
          recentShipments: [
            { shipmentId: 2001, status: 'In Transit', transporter: 'XYZ Ltd.' },
          ],
        };
      case 'Vendor':
        return { message: 'Vendor-specific data' };
      case 'Transporter':
        return { message: 'Transporter-specific data' };
      case 'Manager':
        return { message: 'Manager-specific data' };
      default:
        return { message: 'Role not recognized' };
    }
  }
}
