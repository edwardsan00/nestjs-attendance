import { IsNumber, IsNotEmpty } from 'class-validator';

export class AttendanceList {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;
}
