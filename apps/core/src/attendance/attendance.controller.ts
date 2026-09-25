import { Controller, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { AttendanceList } from './dto/attendance-list.js';
import { ATTENDANCE_EVENTS } from '@shared/contracts/events/attendance';
import { AttendanceService } from './attendance.service.js';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern(ATTENDANCE_EVENTS.CHECK_IN)
  marcarEntrada(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.marcarEntrada(createAttendanceDto);
  }

  @MessagePattern(ATTENDANCE_EVENTS.CHECK_OUT)
  marcarSalida(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.marcarSalida(createAttendanceDto);
  }

  @MessagePattern(ATTENDANCE_EVENTS.ATTENDANCE_LIST)
  obtenerAsistencias(@Body() payload: AttendanceList) {
    return this.attendanceService.obtenerAsistencias(payload);
  }
}
