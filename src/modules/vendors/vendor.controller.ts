import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VendorStatus } from './vendor-status.enum';

@Controller('vendors')
@UseGuards(RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  @Roles('Admin')
  getAllVendors() {
    return this.vendorService.getAllVendors();
  }

  @Post('register')
  registerVendor(@Body() registerVendorDto: any) {
    return this.vendorService.registerVendor(registerVendorDto);
  }

  @Put(':id/approve')
  @Roles('Admin', 'Manager')
  approveVendor(@Param('id') id: string, @Body('status') status: VendorStatus) {
    return this.vendorService.updateVendorStatus(id, status);
  }

  @Put(':id/reject')
  @Roles('Admin')
  rejectVendor(@Param('id') id: number) {
    return this.vendorService.rejectVendor(id);
  }
}
