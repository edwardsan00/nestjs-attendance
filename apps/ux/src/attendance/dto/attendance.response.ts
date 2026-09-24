import { ApiProperty } from '@nestjs/swagger';
import { CreateAttendanceRequestDto } from './attendance.request.js';

export class CreateAttendanceResponseDto extends CreateAttendanceRequestDto {
  @ApiProperty({
    example: 100,
  })
  id: number;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  createdAt: string;
}
