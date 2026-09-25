import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceResponseDto } from './dto/attendance.response.js';
import { CreateAttendanceRequestDto } from './dto/attendance.request.js';

@ApiTags('Asistencias')
@Controller('asistencias')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('entrada')
  @ApiOperation({ summary: 'Registrar entrada de asistencia' })
  @ApiResponse({
    status: 201,
    description: 'Entrada de asistencia registrada exitosamente',
    type: CreateAttendanceResponseDto,
  })
  @ApiBadRequestResponse({
    schema: {
      oneOf: [
        {
          example: {
            statusCode: 400,
            message: 'El empleado ya tiene una entrada registrada sin salida',
            error: 'Bad Request',
          },
          description: 'El empleado ya tiene una entrada registrada sin salida',
        },
        {
          example: {
            statusCode: 400,
            message: [
              'employeeId must be a number conforming to the specified constraints',
              'latitud must be a latitude string or number',
              'longitud must be a longitude string or number',
            ],
            error: 'Bad Request',
          },
          description: 'Datos de entrada invalidos',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'Empleado con ID 999 no encontrado',
      error: 'Not Found',
    },
  })
  async entrada(
    @Body() createAttendanceDto: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    return this.attendanceService.marcarEntrada(createAttendanceDto);
  }

  @Post('salida')
  @ApiOperation({ summary: 'Registrar salida de asistencia' })
  @ApiResponse({
    status: 201,
    description: 'Salida de asistencia registrada exitosamente',
    type: CreateAttendanceResponseDto,
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'Empleado con ID 999 no encontrado',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      oneOf: [
        {
          example: {
            statusCode: 400,
            message: 'No hay una entrada registrada para marcar salida',
            error: 'Bad Request',
          },
          description: 'Marcar doble salida',
        },
        {
          example: {
            statusCode: 400,
            message:
              'La hora de salida debe ser posterior a la hora de entrada',
            error: 'Bad Request',
          },
          description: 'Error con la hora de salida',
        },
      ],
    },
  })
  async salida(
    @Body() createAttendanceDto: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    return this.attendanceService.marcarSalida(createAttendanceDto);
  }

  @Get('employee/:id')
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'Empleado con ID 999 no encontrado',
      error: 'Not Found',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Salida de asistencia registrada exitosamente',
    type: [CreateAttendanceResponseDto],
  })
  async obtenerAsistencias(@Param('id') id: string) {
    return this.attendanceService.obtenerAsistencias(Number(id));
  }
}
