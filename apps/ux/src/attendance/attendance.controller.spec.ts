import { describe, expect, it, vi } from 'vitest';
import { AttendanceController } from './attendance.controller.js';
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

describe('AttendanceController', () => {
  const attendanceService = {
    marcarEntrada: vi.fn(),
    marcarSalida: vi.fn(),
    obtenerAsistencias: vi.fn(),
  };
  const controller = new AttendanceController(
    attendanceService as unknown as AttendanceService,
  );

  it('delega la entrada al service y devuelve su respuesta', async () => {
    attendanceService.marcarEntrada.mockResolvedValue(response);

    await expect(controller.entrada(payload)).resolves.toEqual(response);

    expect(attendanceService.marcarEntrada).toHaveBeenCalledWith(payload);
  });

  it('delega la salida al service y devuelve su respuesta', async () => {
    attendanceService.marcarSalida.mockResolvedValue(response);

    await expect(controller.salida(payload)).resolves.toEqual(response);

    expect(attendanceService.marcarSalida).toHaveBeenCalledWith(payload);
  });

  it('convierte el id de la ruta a número antes de delegar', async () => {
    attendanceService.obtenerAsistencias.mockResolvedValue([response]);

    await expect(controller.obtenerAsistencias('1')).resolves.toEqual([
      response,
    ]);

    expect(attendanceService.obtenerAsistencias).toHaveBeenCalledWith(1);
  });
});
