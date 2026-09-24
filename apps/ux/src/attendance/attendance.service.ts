import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  getHello() {
    return {
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
    };
  }
}
