import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorStatus } from './vendor.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  getAllVendors() {
    return this.vendorRepository.find();
  }

  registerVendor(registerVendorDto: any) {
    const vendor = this.vendorRepository.create(registerVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async approveVendor(id: number): Promise<void> {
    await this.vendorRepository.update(id, { status: VendorStatus.APPROVED });
  }

  async rejectVendor(id: number): Promise<void> {
    await this.vendorRepository.update(id, { status: VendorStatus.REJECTED });
  }

  async updateVendorStatus(id: string, status: VendorStatus): Promise<Vendor> {
    const vendorId = parseInt(id, 10); // Convert string ID to number
    const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    vendor.status = status;
    return this.vendorRepository.save(vendor);
  }
}
