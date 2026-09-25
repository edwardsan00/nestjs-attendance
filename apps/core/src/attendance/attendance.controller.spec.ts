import { describe, expect, it, vi } from 'vitest';
import { AttendanceController } from './attendance.controller.js';
import { AttendanceType } from './dto/create-attendance.dto.js';

const payload = {
  employeeId: 1,
  tipo: AttendanceType.ENTRADA,
  latitud: -12.0464,
  longitud: -77.0428,
  horaRegistro: '2026-09-25T08:00:00.000Z',
};

const data = {
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
  const controller = new AttendanceController(attendanceService as never);

  it('delega el registro de entrada al service', async () => {
    attendanceService.marcarEntrada.mockResolvedValue(data);

    await expect(controller.marcarEntrada(payload)).resolves.toBe(data);

    expect(attendanceService.marcarEntrada).toHaveBeenCalledWith(payload);
  });

  it('delega el registro de salida al service', async () => {
    const salidaPayload = { ...payload, tipo: AttendanceType.SALIDA };
    const response = { ...data, tipo: AttendanceType.SALIDA };
    attendanceService.marcarSalida.mockResolvedValue(response);

    await expect(controller.marcarSalida(salidaPayload)).resolves.toBe(
      response,
    );

    expect(attendanceService.marcarSalida).toHaveBeenCalledWith(salidaPayload);
  });

  it('delega la consulta de asistencias al service', async () => {
    const listPayload = { employeeId: payload.employeeId };
    const response = [data];
    attendanceService.obtenerAsistencias.mockResolvedValue(response);

    await expect(controller.obtenerAsistencias(listPayload)).resolves.toBe(
      response,
    );

    expect(attendanceService.obtenerAsistencias).toHaveBeenCalledWith(
      listPayload,
    );
  });
});
