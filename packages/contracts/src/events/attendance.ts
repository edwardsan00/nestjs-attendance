export const ATTENDANCE_EVENTS = {
  CHECK_IN: { cmd: 'attendance.check-in' },
  CHECK_OUT: { cmd: 'attendance.check-out' },
  ATTENDANCE_LIST: { cmd: 'attendance.list' },
} as const;
