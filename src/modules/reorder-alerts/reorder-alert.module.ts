import { Module } from '@nestjs/common';
import { ReorderAlertController } from './reorder-alert.controller';
import { ReorderAlertService } from './reorder-alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReorderAlert } from './reorder-alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReorderAlert])],
  controllers: [ReorderAlertController],
  providers: [ReorderAlertService],
})
export class ReorderAlertModule {}
