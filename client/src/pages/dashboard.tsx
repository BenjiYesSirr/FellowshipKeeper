import { useState, useEffect } from "react";
import { useQuests, useCreateQuest, useReturnQuest } from "@/hooks/use-quests";
import { Layout } from "@/components/layout";
import { Dialog } from "@/components/ui/dialog";
import { LiveTimer } from "@/components/live-timer";
import { useToast } from "@/hooks/use-toast";
import { getQuestStatus, getCurrentPeriod, SCHOOL_PERIODS } from "@/lib/time-utils";
import { PenTool, Shield, User, Loader2, Sparkles, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: quests, isLoading } = useQuests();
  const activeQuests = quests?.filter(q => !q.returnedAt) || [];
  
  return (
    <Layout>
      <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-2">Gatekeeper's Watch</h2>
          <p className="text-muted-foreground text-lg">Guard the sacred writing instruments.</p>
        </div>
        <RequestPencilFlow />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-display animate-pulse">Consulting the ancient records...</p>
        </div>
      ) : activeQuests.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gold/30 rounded-xl bg-card/50">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-2xl font-display text-muted-foreground">All is quiet.</h3>
          <p className="mt-2 text-muted-foreground">No quests are currently active.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeQuests.map((quest, i) => (
            <QuestCard key={quest.id} quest={quest} index={i} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function RequestPencilFlow() {
  const [step, setStep] = useState<"idle" | "name" | "period" | "oath">("idle");
  const [name, setName] = useState("");
  const [period, setPeriod] = useState<number | null>(null);
  const createQuest = useCreateQuest();
  const { toast } = useToast();

  useEffect(() => {
    if (step === "period") {
      const current = getCurrentPeriod();
      if (current) setPeriod(current);
    }
  }, [step]);

  const handleStart = () => setStep("name");
  const close = () => {
    setStep("idle");
    setName("");
    setPeriod(null);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep("period");
  };

  const handlePeriodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (period) setStep("oath");
  };

  const acceptOath = () => {
    if (!period) return;
    createQuest.mutate({ studentName: name.trim(), periodNumber: period }, {
      onSuccess: () => {
        toast({
          title: "Quest Begun",
          description: "Your quest has begun. You must return the Pencil of Power before the bell tolls.",
          className: "bg-background border-gold text-primary font-display",
        });
        close();
      }
    });
  };

  return (
    <>
      <button
        onClick={handleStart}
        className="group relative px-8 py-4 bg-primary text-primary-foreground font-display font-bold text-lg rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative flex items-center gap-3">
          <Sparkles className="w-5 h-5" />
          Bestow Pencil
        </span>
      </button>

      {/* Step 1: Name Input */}
      <Dialog isOpen={step === "name"} onClose={close} title="Identify Thyself">
        <form onSubmit={handleNameSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              What is the name of the adventurer?
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border border-border rounded-lg py-3 pl-11 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter student name..."
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-secondary text-secondary-foreground border border-gold hover-glow rounded-lg font-display font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </Dialog>

      {/* Step 2: Period Selection */}
      <Dialog isOpen={step === "period"} onClose={close} title="Select Thy Period">
        <form onSubmit={handlePeriodSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-4">
              Which period do you currently serve?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SCHOOL_PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={`py-3 px-4 rounded-lg border font-display transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                    period === p.id 
                      ? 'bg-primary text-primary-foreground border-primary shadow-glow-sm' 
                      : 'bg-input border-border text-muted-foreground hover:border-gold/50'
                  }`}
                >
                  <span className="text-lg font-bold">{p.name}</span>
                  <span className="text-xs opacity-70">{p.start} - {p.end}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!period}
            className="w-full py-3 bg-secondary text-secondary-foreground border border-gold hover-glow rounded-lg font-display font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to the Oath
          </button>
        </form>
      </Dialog>

      {/* Step 3: The Oath */}
      <Dialog isOpen={step === "oath"} onClose={close} title="The Binding Oath">
        <div className="text-center space-y-8">
          <p className="text-xl leading-relaxed text-foreground font-serif italic">
            "Do you swear to return the <strong className="text-primary font-display">Pencil of Power</strong> before the bell of your period rings?"
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={acceptOath}
              disabled={createQuest.isPending}
              className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-display font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
            >
              {createQuest.isPending ? "Forging..." : "Yes, I Swear It"}
            </button>
            <button
              onClick={close}
              className="flex-1 px-6 py-4 bg-transparent border border-destructive text-destructive font-display font-bold rounded-lg hover:bg-destructive/10 transition-colors duration-200"
            >
              No, I Cannot
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function QuestCard({ quest, index }: { quest: any; index: number }) {
  const returnQuest = useReturnQuest();
  const { toast } = useToast();
  const { isOverdue, bellTime } = getQuestStatus(quest.startTime, null, quest.periodNumber);

  const handleReturn = () => {
    returnQuest.mutate(quest.id, {
      onSuccess: (updatedQuest) => {
        const status = getQuestStatus(updatedQuest.startTime, updatedQuest.returnedAt, updatedQuest.periodNumber);
        if (status.isOverdue) {
          toast({
            variant: "destructive",
            title: "Quest Failed",
            description: "🔴 ⚠️ Quest failed. The Pencil of Power was not returned before the bell. The Eye of the Teacher is watching.",
            className: "bg-destructive border-red-500 text-white font-display text-lg py-6",
            duration: 8000,
          });
        } else {
          toast({
            title: "Quest Completed",
            description: "🟢 Quest complete. The Fellowship thanks you.",
            className: "bg-green-900 border-green-500 text-white font-display text-lg py-6",
            duration: 6000,
          });
        }
      }
    });
  };

  return (
    <div 
      className={`bg-card p-6 rounded-xl border relative overflow-hidden flex flex-col animate-in ${
        isOverdue ? 'animate-pulse-red border-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gold hover-glow'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Shield className="w-16 h-16" />
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-display font-bold text-foreground truncate">
            {quest.studentName}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
            Period {quest.periodNumber}
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Bell at: {bellTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="mb-8 relative z-10 p-4 bg-background/50 rounded-lg border border-border">
        <LiveTimer startTime={quest.startTime} periodNumber={quest.periodNumber} />
      </div>

      <button
        onClick={handleReturn}
        disabled={returnQuest.isPending}
        className={`mt-auto relative z-10 w-full py-3 px-4 font-display font-bold rounded-lg transition-all duration-300 flex justify-center items-center gap-2 ${
          isOverdue 
            ? 'bg-destructive/20 text-destructive border border-destructive hover:bg-destructive hover:text-white' 
            : 'bg-secondary text-primary border border-gold hover:bg-primary hover:text-primary-foreground'
        } disabled:opacity-50`}
      >
        {returnQuest.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isOverdue ? (
          <>
            <AlertTriangle className="w-5 h-5" />
            Face Judgment
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Return Relic
          </>
        )}
      </button>
    </div>
  );
}
