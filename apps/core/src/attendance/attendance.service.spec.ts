import { RpcException } from '@nestjs/microservices';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { AttendanceService } from './attendance.service.js';
import {
  AttendanceType,
  CreateAttendanceDto,
} from './dto/create-attendance.dto.js';
import { Attendance } from './entities/attendance.entity.js';

const payload: CreateAttendanceDto = {
  employeeId: 1,
  tipo: AttendanceType.ENTRADA,
  latitud: -12.0464,
  longitud: -77.0428,
  horaRegistro: '2026-09-25T08:00:00.000Z',
};

const createAttendance = (overrides: Partial<Attendance> = {}): Attendance =>
  ({
    id: 10,
    employeeId: payload.employeeId,
    tipo: AttendanceType.ENTRADA,
    latitud: payload.latitud,
    longitud: payload.longitud,
    horaRegistro: new Date(payload.horaRegistro),
    createdAt: new Date(payload.horaRegistro),
    ...overrides,
  }) as Attendance;

describe('AttendanceService', () => {
  const attendanceRepository = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
  };
  const employeeService = { findById: vi.fn() };
  const lateCheck = { check: vi.fn() };
  const service = new AttendanceService(
    attendanceRepository as never,
    employeeService as never,
    lateCheck as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    employeeService.findById.mockResolvedValue({ id: payload.employeeId });
    lateCheck.check.mockReturnValue({ isLate: false, hoursLate: 0 });
  });

  it('registra una entrada cuando no existe una entrada abierta', async () => {
    const attendance = createAttendance();
    attendanceRepository.findOne.mockResolvedValue(null);
    attendanceRepository.create.mockReturnValue(attendance);
    attendanceRepository.save.mockResolvedValue(attendance);

    await expect(service.marcarEntrada(payload)).resolves.toBe(attendance);

    expect(employeeService.findById).toHaveBeenCalledWith(payload.employeeId);
    expect(attendanceRepository.create).toHaveBeenCalledWith({
      ...payload,
      tipo: AttendanceType.ENTRADA,
      horaRegistro: new Date(payload.horaRegistro),
    });
    expect(attendanceRepository.save).toHaveBeenCalledWith(attendance);
  });

  it('rechaza una entrada si el empleado ya tiene una entrada abierta', async () => {
    attendanceRepository.findOne.mockResolvedValue(createAttendance());

    await expect(service.marcarEntrada(payload)).rejects.toBeInstanceOf(
      RpcException,
    );

    expect(attendanceRepository.create).not.toHaveBeenCalled();
    expect(attendanceRepository.save).not.toHaveBeenCalled();
  });

  it('propaga el error cuando no encuentra el empleado', async () => {
    const notFoundError = new RpcException({
      statusCode: 404,
      message: 'Empleado con ID 999 no encontrado',
      error: 'Not Found',
    });
    employeeService.findById.mockRejectedValue(notFoundError);

    await expect(
      service.marcarEntrada({ ...payload, employeeId: 999 }),
    ).rejects.toBe(notFoundError);

    expect(attendanceRepository.findOne).not.toHaveBeenCalled();
    expect(attendanceRepository.create).not.toHaveBeenCalled();
  });

  it('registra una salida posterior a la última entrada', async () => {
    const lastAttendance = createAttendance();
    const salidaPayload = {
      ...payload,
      tipo: AttendanceType.SALIDA,
      horaRegistro: '2026-09-25T10:00:00.000Z',
    };
    const attendance = createAttendance({
      tipo: AttendanceType.SALIDA,
      horaRegistro: new Date(salidaPayload.horaRegistro),
    });
    attendanceRepository.findOne.mockResolvedValue(lastAttendance);
    attendanceRepository.create.mockReturnValue(attendance);
    attendanceRepository.save.mockResolvedValue(attendance);

    await expect(service.marcarSalida(salidaPayload)).resolves.toBe(attendance);

    expect(attendanceRepository.create).toHaveBeenCalledWith({
      ...salidaPayload,
      tipo: AttendanceType.SALIDA,
      horaRegistro: new Date(salidaPayload.horaRegistro),
    });
  });

  it('rechaza una salida cuando no existe una entrada abierta', async () => {
    attendanceRepository.findOne.mockResolvedValue(null);

    await expect(
      service.marcarSalida({ ...payload, tipo: AttendanceType.SALIDA }),
    ).rejects.toBeInstanceOf(RpcException);

    expect(attendanceRepository.create).not.toHaveBeenCalled();
  });

  it('obtiene las asistencias del empleado', async () => {
    const attendances = [createAttendance()];
    attendanceRepository.find.mockResolvedValue(attendances);

    await expect(
      service.obtenerAsistencias({ employeeId: payload.employeeId }),
    ).resolves.toBe(attendances);

    expect(employeeService.findById).toHaveBeenCalledWith(payload.employeeId);
    expect(attendanceRepository.find).toHaveBeenCalledWith({
      where: { employeeId: payload.employeeId },
      order: { createdAt: 'DESC' },
    });
  });
});
