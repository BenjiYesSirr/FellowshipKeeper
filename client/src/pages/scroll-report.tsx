import { useState } from "react";
import { useQuests } from "@/hooks/use-quests";
import { Layout } from "@/components/layout";
import { getQuestStatus, formatDuration, SCHOOL_PERIODS } from "@/lib/time-utils";
import { Loader2, Scroll as ScrollIcon, Check, X, Clock, Filter } from "lucide-react";

export default function ScrollReport() {
  const { data: quests, isLoading } = useQuests();
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all'>('all');

  // Sort by most recent first and filter by period
  const filteredQuests = (quests || [])
    .filter(q => selectedPeriod === 'all' || q.periodNumber === selectedPeriod)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  return (
    <Layout>
      <div className="mb-10 text-center">
        <ScrollIcon className="w-12 h-12 mx-auto text-primary mb-4" />
        <h2 className="text-4xl font-display text-gold-gradient mb-4">
          📜 Scroll of the Fellowship {selectedPeriod !== 'all' ? `– Period ${selectedPeriod}` : ""}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The eternal record of those who ventured forth with the Pencil of Power. 
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Filter by Period</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-4 py-2 rounded-lg font-display text-sm transition-all ${
              selectedPeriod === 'all' 
                ? 'bg-primary text-primary-foreground shadow-glow-sm' 
                : 'bg-card border border-border text-muted-foreground hover:border-gold/50'
            }`}
          >
            All Quests
          </button>
          {SCHOOL_PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id)}
              className={`px-4 py-2 rounded-lg font-display text-sm transition-all ${
                selectedPeriod === p.id 
                  ? 'bg-primary text-primary-foreground shadow-glow-sm' 
                  : 'bg-card border border-border text-muted-foreground hover:border-gold/50'
              }`}
            >
              Period {p.id}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-primary">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground italic bg-card/50 border border-dashed border-border rounded-xl">
          The scroll is currently blank for this selection.
        </div>
      ) : (
        <div className="bg-card border border-gold rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-6 py-4 font-display font-bold text-primary">Adventurer</th>
                  <th className="px-6 py-4 font-display font-bold text-primary text-center">Period</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Departed At</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Returned At</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Duration</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredQuests.map((quest) => {
                  const { elapsedSeconds, isOverdue, isActive } = getQuestStatus(quest.startTime, quest.returnedAt, quest.periodNumber);
                  
                  return (
                    <tr key={quest.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {quest.studentName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-xs font-bold">
                          {quest.periodNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {quest.startTime.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {isActive ? (
                          <span className="text-yellow-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Still active
                          </span>
                        ) : (
                          quest.returnedAt?.toLocaleTimeString()
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {formatDuration(elapsedSeconds)}
                      </td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          isOverdue ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-semibold border border-destructive/50">
                              <X className="w-4 h-4" /> Failing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/50">
                              <Clock className="w-4 h-4 animate-pulse" /> Questing
                            </span>
                          )
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-semibold border border-destructive/50">
                            <X className="w-4 h-4" /> Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold border border-green-500/50">
                            <Check className="w-4 h-4" /> Honored
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
