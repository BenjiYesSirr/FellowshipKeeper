import { useQuests } from "@/hooks/use-quests";
import { Layout } from "@/components/layout";
import { getQuestStatus, formatDuration } from "@/lib/time-utils";
import { Loader2, Scroll as ScrollIcon, Check, X, Clock } from "lucide-react";

export default function ScrollReport() {
  const { data: quests, isLoading } = useQuests();

  // Sort by most recent first
  const sortedQuests = quests?.slice().sort((a, b) => b.startTime.getTime() - a.startTime.getTime()) || [];

  return (
    <Layout>
      <div className="mb-10 text-center">
        <ScrollIcon className="w-12 h-12 mx-auto text-primary mb-4" />
        <h2 className="text-4xl font-display text-gold-gradient mb-4">Scroll of the Fellowship</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The eternal record of those who ventured forth with the Pencil of Power. 
          Here lies the tale of their triumphs and their failings.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-primary">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      ) : sortedQuests.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground italic">
          The scroll is currently blank. No quests have been recorded.
        </div>
      ) : (
        <div className="bg-card border border-gold rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-6 py-4 font-display font-bold text-primary">Adventurer</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Departed At</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Returned At</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Duration</th>
                  <th className="px-6 py-4 font-display font-bold text-primary">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedQuests.map((quest) => {
                  const { elapsedSeconds, isOverdue, isActive } = getQuestStatus(quest.startTime, quest.returnedAt);
                  
                  return (
                    <tr key={quest.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {quest.studentName}
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
