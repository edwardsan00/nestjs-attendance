import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { differenceInHours } from 'date-fns';
import {
  CreateAttendanceDto,
  AttendanceType,
} from './dto/create-attendance.dto.js';
import { AttendanceList } from './dto/attendance-list.js';
import { Attendance } from './entities/attendance.entity.js';
import { EmployeesService } from 'src/employees/employees.service.js';
import { RpcException } from '@nestjs/microservices';
import { LateArrivalCheckService } from './service/late-arrival-check.service.js';

@Injectable()
export class AttendanceService {
  private logger = new Logger(AttendanceService.name);
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private employeeService: EmployeesService,
    private lateCheck: LateArrivalCheckService,
  ) {}

  private async obtenerUltimoRegistro(
    employeeId: number,
  ): Promise<Attendance | null> {
    return await this.attendanceRepository.findOne({
      where: { employeeId },
      order: { createdAt: 'DESC', id: 'DESC' },
      loadEagerRelations: false,
    });
  }

  async marcarEntrada(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    await this.employeeService.findById(createAttendanceDto.employeeId);

    const lastAttendance = await this.obtenerUltimoRegistro(
      createAttendanceDto.employeeId,
    );

    if (createAttendanceDto.tipo === AttendanceType.SALIDA)
      throw new RpcException({
        statusCode: 400,
        message: 'Error en valor de tipo para el servicio de entrada',
        error: 'Bad Request',
      });

    if (lastAttendance && lastAttendance.tipo === AttendanceType.ENTRADA)
      throw new RpcException({
        statusCode: 400,
        message: 'El empleado ya tiene una entrada registrada sin salida',
        error: 'Bad Request',
      });

    const { isLate } = this.lateCheck.check(
      new Date(createAttendanceDto.horaRegistro),
    );

    if (isLate)
      this.logger.log(
        `Envio de notificacion a empleado ${createAttendanceDto.employeeId} por llegar tarde`,
      );

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      tipo: AttendanceType.ENTRADA,
      horaRegistro: new Date(createAttendanceDto.horaRegistro),
    });

    return this.attendanceRepository.save(attendance);
  }

  async marcarSalida(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
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

  async obtenerAsistencias({ employeeId }: AttendanceList) {
    await this.employeeService.findById(employeeId);

    return this.attendanceRepository.find({
      where: { employeeId },
      order: { createdAt: 'DESC' },
    });
  }
}
