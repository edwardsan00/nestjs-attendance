import { Injectable } from '@nestjs/common';
import { set, differenceInHours } from 'date-fns';

interface LateCheckResult {
  isLate: boolean;
  hoursLate: number;
}

@Injectable()
export class LateArrivalCheckService {
  private readonly DEFAULT_ENTRY_HOUR = 9;

  check(
    registrationDate: Date,
    entryHour: number = this.DEFAULT_ENTRY_HOUR,
  ): LateCheckResult {
    const expectedEntryDate = set(registrationDate, {
      hours: entryHour,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    const diff = differenceInHours(registrationDate, expectedEntryDate);

    const isLate = diff >= 1;

    return {
      isLate,
      hoursLate: isLate ? diff : 0,
    };
  }
}
