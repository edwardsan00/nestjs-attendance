import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './employees/employees.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { Employee } from './employees/entities/employee.entity.js';
import { Attendance } from './attendance/entities/attendance.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Employee, Attendance],
      synchronize: false,
      options: {
        encrypt: false, // Cambiar a true si usas Azure SQL
        trustServerCertificate: true,
      },
    }),
    EmployeesModule,
    AttendanceModule,
  ],
})
export class AppModule {}
