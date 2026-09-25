import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { ATTENDANCE_EVENTS } from '@shared/contracts/events/attendance';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceRequestDto } from './dto/attendance.request.js';
import { CreateAttendanceResponseDto } from './dto/attendance.response.js';

const payload: CreateAttendanceRequestDto = {
  employeeId: 1,
  tipo: 'entrada',
  latitud: -12.0464,
  longitud: -77.0428,
  horaRegistro: '2026-09-25T08:00:00.000Z',
};

const response: CreateAttendanceResponseDto = {
  id: 10,
  employeeId: payload.employeeId,
  tipo: payload.tipo,
  latitud: payload.latitud,
  longitud: payload.longitud,
  horaRegistro: payload.horaRegistro,
  createdAt: '2026-09-25T08:00:00.000Z',
};

describe('AttendanceService', () => {
  const send = vi.fn();
  const service = new AttendanceService({ send } as unknown as ClientProxy);

  it('marca una entrada usando el evento y payload correctos', async () => {
    send.mockReturnValue(of(response));

    await expect(service.marcarEntrada(payload)).resolves.toEqual(response);

    expect(send).toHaveBeenCalledWith(ATTENDANCE_EVENTS.CHECK_IN, payload);
  });

  it('marca una salida usando el evento y payload correctos', async () => {
    send.mockReturnValue(of(response));

    await expect(service.marcarSalida(payload)).resolves.toEqual(response);

    expect(send).toHaveBeenCalledWith(ATTENDANCE_EVENTS.CHECK_OUT, payload);
  });

  it('obtiene las asistencias del empleado usando su id', async () => {
    const attendances = [response];
    send.mockReturnValue(of(attendances));

    await expect(service.obtenerAsistencias(payload.employeeId)).resolves.toEqual(
      attendances,
    );

    expect(send).toHaveBeenCalledWith(ATTENDANCE_EVENTS.ATTENDANCE_LIST, {
      employeeId: payload.employeeId,
    });
  });
});