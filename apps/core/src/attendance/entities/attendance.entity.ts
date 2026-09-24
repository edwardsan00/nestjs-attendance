import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { Employee } from '../../employees/entities/employee.entity.js';
import { AttendanceType } from '@shared/contracts/dtos/attendance';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @ManyToOne('Employee', (employee: Employee) => employee.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({
    type: 'varchar',
    length: 20,
    enum: AttendanceType,
  })
  tipo: AttendanceType;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud: number;

  @Column({ type: 'datetime' })
  horaRegistro: Date;

  @CreateDateColumn()
  createdAt: Date;
}
