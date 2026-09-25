import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateAttendanceDto } from './create-attendance.dto.js';

describe('CreateAttendanceDto', () => {
  it('reporta errores cuando faltan todos los datos obligatorios', async () => {
    const dto = plainToInstance(CreateAttendanceDto, {});

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining([
        'employeeId',
        'tipo',
        'latitud',
        'longitud',
        'horaRegistro',
      ]),
    );
  });
});
