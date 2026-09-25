import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import type { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findById(id: number): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });

    if (!employee)
      throw new RpcException({
        statusCode: 404,
        message: `Empleado con ID ${id} no encontrado`,
        error: 'Not Found',
      });
    return employee;
  }
}
