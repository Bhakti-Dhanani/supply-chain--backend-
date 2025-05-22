import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleLog } from './vehicle-log.entity';

@Injectable()
export class VehicleLogService {
  constructor(
    @InjectRepository(VehicleLog)
    private readonly vehicleLogRepository: Repository<VehicleLog>,
  ) {}

  getAllLogs() {
    return this.vehicleLogRepository.find();
  }

  addLog(addLogDto: any) {
    const log = this.vehicleLogRepository.create(addLogDto);
    return this.vehicleLogRepository.save(log);
  }
}
