import { useState, useEffect } from "react";
import { formatDuration, getQuestStatus } from "@/lib/time-utils";
import { Hourglass, Eye } from "lucide-react";

interface LiveTimerProps {
  startTime: Date;
}

export function LiveTimer({ startTime }: LiveTimerProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { elapsedSeconds, remainingSeconds, isOverdue } = getQuestStatus(startTime, null);

  if (isOverdue) {
    return (
      <div className="flex items-center gap-2 text-destructive font-bold text-lg">
        <Eye className="w-5 h-5 animate-pulse" />
        <span>Overdue by {formatDuration(Math.abs(remainingSeconds))}</span>
      </div>
    );
  }

  // Warning when less than 5 minutes remain
  const isWarning = remainingSeconds <= 300;

  return (
    <div className={`flex items-center gap-2 font-mono text-xl ${isWarning ? 'text-yellow-500 animate-pulse' : 'text-primary'}`}>
      <Hourglass className={`w-5 h-5 ${isWarning ? 'animate-spin' : ''}`} />
      <span>{formatDuration(remainingSeconds)} remaining</span>
    </div>
  );
}
