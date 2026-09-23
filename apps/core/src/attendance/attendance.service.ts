import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAttendanceDto,
  AttendanceType,
} from '@shared/contracts/dtos/attendance';
import { Attendance } from './entities/attendance.entity.js';
import { EmployeesService } from 'src/employees/employees.service.ts';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private employeeService: EmployeesService,
  ) {}

  private async validarEntradaSinSalida(
    employeeId: number,
  ): Promise<Attendance | null> {
    const lastAttendance = await this.attendanceRepository.findOne({
      where: { employeeId },
      order: { horaRegistro: 'DESC' },
    });

    if (lastAttendance && lastAttendance.tipo === AttendanceType.ENTRADA)
      throw new RpcException({
        statusCode: 400,
        message: 'El empleado ya tiene una entrada registrada sin salida',
        error: 'Bad Request',
      });

    return lastAttendance;
  }

  async marcarEntrada(createAttendanceDto: CreateAttendanceDto) {
    // Validar que el empleado existe
    await this.employeeService.findById(createAttendanceDto.employeeId);

    await this.validarEntradaSinSalida(createAttendanceDto.employeeId);

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      tipo: AttendanceType.ENTRADA,
      horaRegistro: new Date(createAttendanceDto.horaRegistro),
    });

    return this.attendanceRepository.save(attendance);
  }

  async marcarSalida(createAttendanceDto: CreateAttendanceDto) {
    // Validar que el empleado existe
    await this.employeeService.findById(createAttendanceDto.employeeId);

    const horaRegistro = new Date(createAttendanceDto.horaRegistro);

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      tipo: AttendanceType.SALIDA,
      horaRegistro,
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
