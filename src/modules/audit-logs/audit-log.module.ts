import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [AuditLogService],
})
export class AuditLogModule {}
