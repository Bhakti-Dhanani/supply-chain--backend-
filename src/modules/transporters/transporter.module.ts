import { Module } from '@nestjs/common';
import { TransporterController } from './transporter.controller';
import { TransporterService } from './transporter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transporter } from './transporter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transporter])],
  controllers: [TransporterController],
  providers: [TransporterService],
  exports: [TypeOrmModule],
})
export class TransporterModule {}
