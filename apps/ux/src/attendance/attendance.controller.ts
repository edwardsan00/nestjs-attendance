import { Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service.ts';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('entrada')
  getHello() {
    return this.attendanceService.getHello();
  }
}
