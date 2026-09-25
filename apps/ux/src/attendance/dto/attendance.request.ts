import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

const AttendanceType = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
} as const;

type AttendanceType = (typeof AttendanceType)[keyof typeof AttendanceType];

export class CreateAttendanceRequestDto {
  @ApiProperty({
    description: 'ID del empleado',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @ApiProperty({
    description: 'Tipo de asistencia',
    example: AttendanceType.ENTRADA,
    enum: AttendanceType,
  })
  @IsNotEmpty()
  @IsEnum(AttendanceType)
  tipo: AttendanceType;

  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: -12.0464,
  })
  @IsNotEmpty()
  @IsLatitude()
  latitud: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -77.0428,
  })
  @IsNotEmpty()
  @IsLongitude()
  longitud: number;

  @ApiProperty({
    description: 'Hora de registro de la asistencia',
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDateString()
  horaRegistro: string;
}
