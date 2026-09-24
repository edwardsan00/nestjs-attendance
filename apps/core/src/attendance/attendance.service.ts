import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAttendanceDto,
  AttendanceType,
} from '@shared/contracts/dtos/attendance';
import { Attendance } from './entities/attendance.entity.js';
import { EmployeesService } from 'src/employees/employees.service.js';
import { RpcException } from '@nestjs/microservices';
import { differenceInHours } from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private employeeService: EmployeesService,
  ) {}

  private async obtenerUltimoRegistro(
    employeeId: number,
  ): Promise<Attendance | null> {
    return await this.attendanceRepository.findOne({
      where: { employeeId },
      order: { horaRegistro: 'DESC' },
    });
  }

  async marcarEntrada(createAttendanceDto: CreateAttendanceDto) {
    await this.employeeService.findById(createAttendanceDto.employeeId);

    const lastAttendance = await this.obtenerUltimoRegistro(
      createAttendanceDto.employeeId,
    );

    if (lastAttendance && lastAttendance.tipo === AttendanceType.ENTRADA)
      throw new RpcException({
        statusCode: 400,
        message: 'El empleado ya tiene una entrada registrada sin salida',
        error: 'Bad Request',
      });

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      tipo: AttendanceType.ENTRADA,
      horaRegistro: new Date(createAttendanceDto.horaRegistro),
    });

    return this.attendanceRepository.save(attendance);
  }

  async marcarSalida(createAttendanceDto: CreateAttendanceDto) {
    await this.employeeService.findById(createAttendanceDto.employeeId);

    const lastAttendance = await this.obtenerUltimoRegistro(
      createAttendanceDto.employeeId,
    );

    if (
      !lastAttendance ||
      (lastAttendance && lastAttendance.tipo === AttendanceType.SALIDA)
    )
      throw new RpcException({
        statusCode: 400,
        message: 'No hay una entrada registrada para marcar salida',
        error: 'Bad Request',
      });

    const getCheckInDate = new Date(lastAttendance.horaRegistro);
    const getCheckOutDate = new Date(createAttendanceDto.horaRegistro);

    if (differenceInHours(getCheckOutDate, getCheckInDate) < 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'La hora de salida debe ser posterior a la hora de entrada',
        error: 'Bad Request',
      });
    }

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      tipo: AttendanceType.SALIDA,
      horaRegistro: getCheckOutDate,
    });

    return this.attendanceRepository.save(attendance);
  }

  async obtenerAsistencias(employeeId: number) {
    await this.employeeService.findById(employeeId);

    return this.attendanceRepository.find({
      where: { employeeId },
      order: { horaRegistro: 'DESC' },
    });
  }
}
