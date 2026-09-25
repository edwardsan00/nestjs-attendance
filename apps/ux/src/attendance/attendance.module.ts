import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AttendanceController } from './attendance.controller.js';
import {
  AttendanceService,
  ATTENDANCE_SERVICE_TOKEN,
} from './attendance.service.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ATTENDANCE_SERVICE_TOKEN,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>(
              'ATTENDANCE_SERVICE_HOST',
              'aapcore',
            ),
            port: configService.get<number>(
              'ATTENDANCE_SERVICE_PORT',
              Number(process.env.UX_PORT),
            ),
          },
        }),
      },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
