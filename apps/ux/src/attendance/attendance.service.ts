import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { ATTENDANCE_EVENTS } from '@shared/contracts/events/attendance';
import { CreateAttendanceRequestDto } from './dto/attendance.request.js';
import { CreateAttendanceResponseDto } from './dto/attendance.response.js';

export const ATTENDANCE_SERVICE_TOKEN = 'ATTENDANCE_SERVICE_CLIENT';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(ATTENDANCE_SERVICE_TOKEN)
    private readonly attendanceClient: ClientProxy,
  ) {}
  async marcarEntrada(
    payload: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    const data = await firstValueFrom(
      this.attendanceClient.send<CreateAttendanceResponseDto>(
        ATTENDANCE_EVENTS.CHECK_IN,
        payload,
      ),
    );

    return data;
  }

  async marcarSalida(
    payload: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    const data = await firstValueFrom(
      this.attendanceClient.send<CreateAttendanceResponseDto>(
        ATTENDANCE_EVENTS.CHECK_OUT,
        payload,
      ),
    );

    return data;
  }

  async obtenerAsistencias(
    employeeId: number,
  ): Promise<CreateAttendanceResponseDto[]> {
    const data = await firstValueFrom(
      this.attendanceClient.send(ATTENDANCE_EVENTS.ATTENDANCE_LIST, {
        employeeId,
      }),
    );
    return data;
  }
}
