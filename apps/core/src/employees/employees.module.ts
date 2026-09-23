import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee as EmployeeEntity } from './entities/employee.entity.ts';
import { EmployeesService } from './employees.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  exports: [EmployeesService],
  providers: [EmployeesService],
})
export class EmployeesModule {}
