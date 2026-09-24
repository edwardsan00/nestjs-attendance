import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export const AttendanceType = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
} as const;

export type AttendanceType =
  (typeof AttendanceType)[keyof typeof AttendanceType];

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @IsEnum(AttendanceType)
  tipo: AttendanceType;

  @IsNotEmpty()
  @IsLatitude()
  latitud: number;

  @IsNotEmpty()
  @IsLongitude()
  longitud: number;

  @IsNotEmpty()
  @IsDateString()
  horaRegistro: string;
}
