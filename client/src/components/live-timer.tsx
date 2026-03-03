import { useState, useEffect } from "react";
import { formatDuration, getQuestStatus } from "@/lib/time-utils";
import { Clock, Hourglass, ShieldAlert } from "lucide-react";

export function LiveTimer({ startTime, periodNumber }: { startTime: Date | string, periodNumber: number }) {
  const [now, setNow] = useState(new Date());
  const dateStart = typeof startTime === 'string' ? new Date(startTime) : startTime;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { elapsedSeconds, remainingSeconds, isOverdue } = getQuestStatus(dateStart, null, periodNumber);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Elapsed Time</span>
        </div>
        <span className="font-mono text-xl text-foreground font-bold">
          {formatDuration(elapsedSeconds)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${isOverdue ? 'text-destructive' : 'text-primary'}`}>
          {isOverdue ? <ShieldAlert className="w-4 h-4" /> : <Hourglass className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {isOverdue ? 'Overdue By' : 'Time Remaining'}
          </span>
        </div>
        <span className={`font-mono text-3xl font-black tabular-nums tracking-tighter ${
          isOverdue ? 'text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-primary drop-shadow-glow'
        }`}>
          {formatDuration(remainingSeconds)}
        </span>
      </div>
      
      {/* Progress Bar - Based on a standard 54m period length for visualization */}
      {!isOverdue && (
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-linear shadow-glow-sm"
            style={{ 
              width: `${Math.max(0, Math.min(100, (remainingSeconds / (54 * 60)) * 100))}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}
