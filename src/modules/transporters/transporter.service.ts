import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transporter } from './transporter.entity';

@Injectable()
export class TransporterService {
  constructor(
    @InjectRepository(Transporter)
    private readonly transporterRepository: Repository<Transporter>,
  ) {}

  getAllTransporters() {
    return this.transporterRepository.find();
  }

  registerTransporter(registerTransporterDto: any) {
    const transporter = this.transporterRepository.create(registerTransporterDto);
    return this.transporterRepository.save(transporter);
  }
}
