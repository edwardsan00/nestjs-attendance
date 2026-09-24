import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import type { Attendance } from 'src/attendance/entities/attendance.entity.js';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  numeroDocumento: string;

  @OneToMany('Attendance', (attendance: Attendance) => attendance.employee)
  attendances: Attendance[];
}
