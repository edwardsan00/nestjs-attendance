import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateAttendanceDto } from '@shared/contracts/dtos/attendance';
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
  obtenerAsistencias(@Param('id', ParseIntPipe) employeeId: number) {
    return this.attendanceService.obtenerAsistencias(employeeId);
  }
}
