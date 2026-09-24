import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee as EmployeeEntity } from './entities/employee.entity.js';
import { EmployeesService } from './employees.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  exports: [EmployeesService],
  providers: [EmployeesService],
})
export class EmployeesModule {}
