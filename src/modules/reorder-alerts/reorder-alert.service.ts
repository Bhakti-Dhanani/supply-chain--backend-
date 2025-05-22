import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReorderAlert } from './reorder-alert.entity';

@Injectable()
export class ReorderAlertService {
  constructor(
    @InjectRepository(ReorderAlert)
    private readonly reorderAlertRepository: Repository<ReorderAlert>,
  ) {}

  getAllReorderAlerts() {
    return this.reorderAlertRepository.find();
  }

  setReorderAlert(setReorderAlertDto: any) {
    const reorderAlert = this.reorderAlertRepository.create(setReorderAlertDto);
    return this.reorderAlertRepository.save(reorderAlert);
  }
}
