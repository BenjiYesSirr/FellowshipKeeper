import { differenceInSeconds } from "date-fns";

export const FIFTY_FOUR_MINUTES_IN_SECONDS = 54 * 60; // 3240 seconds

export function formatDuration(seconds: number): string {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const m = Math.floor(absSeconds / 60);
  const s = absSeconds % 60;
  const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return isNegative ? `-${timeStr}` : timeStr;
}

export function getQuestStatus(startTime: Date, returnedAt: Date | null) {
  const endTime = returnedAt || new Date();
  const elapsedSeconds = differenceInSeconds(endTime, startTime);
  const isOverdue = elapsedSeconds > FIFTY_FOUR_MINUTES_IN_SECONDS;
  const remainingSeconds = FIFTY_FOUR_MINUTES_IN_SECONDS - elapsedSeconds;
  
  return {
    elapsedSeconds,
    remainingSeconds,
    isOverdue,
    isActive: !returnedAt,
  };
}
