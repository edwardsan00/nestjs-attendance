import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module.ts';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AttendanceModule],
})
export class AppModule {}
