import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller.js';
import { AttendanceService } from './attendance.service.js';
import { Attendance as AttendanceEntity } from './entities/attendance.entity.js';
import { EmployeesModule } from 'src/employees/employees.module.js';
import { LateArrivalCheckService } from './service/late-arrival-check.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity]), EmployeesModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, LateArrivalCheckService],
})
export class AttendanceModule {}
