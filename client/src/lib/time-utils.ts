import { differenceInSeconds, setHours, setMinutes, isBefore, isAfter, startOfDay } from "date-fns";

export const SCHOOL_PERIODS = [
  { id: 1, name: "1st Period", start: "08:00", end: "08:54" },
  { id: 2, name: "2nd Period", start: "08:58", end: "09:52" },
  { id: 3, name: "3rd Period", start: "09:56", end: "10:53" },
  { id: 4, name: "4th Period", start: "10:57", end: "12:21" },
  { id: 5, name: "5th Period", start: "12:25", end: "13:19" }, // 1:19 PM
  { id: 6, name: "6th Period", start: "13:23", end: "14:17" }, // 2:17 PM
  { id: 7, name: "7th Period", start: "14:21", end: "15:15" }, // 3:15 PM
];

export function getBellTimeForPeriod(periodId: number, date: Date = new Date()): Date {
  const period = SCHOOL_PERIODS.find(p => p.id === periodId);
  if (!period) return new Date();

  const [hours, minutes] = period.end.split(":").map(Number);
  return setMinutes(setHours(startOfDay(date), hours), minutes);
}

export function getCurrentPeriod(): number | null {
  const now = new Date();
  for (const period of SCHOOL_PERIODS) {
    const [sH, sM] = period.start.split(":").map(Number);
    const [eH, eM] = period.end.split(":").map(Number);
    const start = setMinutes(setHours(startOfDay(now), sH), sM);
    const end = setMinutes(setHours(startOfDay(now), eH), eM);
    
    if (isAfter(now, start) && isBefore(now, end)) {
      return period.id;
    }
  }
  return null;
}

export function formatDuration(seconds: number): string {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const m = Math.floor(absSeconds / 60);
  const s = absSeconds % 60;
  const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return isNegative ? `-${timeStr}` : timeStr;
}

export function getQuestStatus(startTime: Date, returnedAt: Date | null, periodNumber: number) {
  const bellTime = getBellTimeForPeriod(periodNumber, startTime);
  const endTime = returnedAt || new Date();
  
  const elapsedSeconds = differenceInSeconds(endTime, startTime);
  const isOverdue = isAfter(endTime, bellTime);
  const remainingSeconds = differenceInSeconds(bellTime, endTime);
  
  return {
    elapsedSeconds,
    remainingSeconds,
    isOverdue,
    isActive: !returnedAt,
    bellTime,
  };
}
