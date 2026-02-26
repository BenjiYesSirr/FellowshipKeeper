import { useState } from "react";
import { useQuests, useCreateQuest, useReturnQuest } from "@/hooks/use-quests";
import { Layout } from "@/components/layout";
import { Dialog } from "@/components/ui/dialog";
import { LiveTimer } from "@/components/live-timer";
import { useToast } from "@/hooks/use-toast";
import { getQuestStatus } from "@/lib/time-utils";
import { PenTool, Shield, User, Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";

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
  const [step, setStep] = useState<"idle" | "name" | "oath">("idle");
  const [name, setName] = useState("");
  const createQuest = useCreateQuest();
  const { toast } = useToast();

  const handleStart = () => setStep("name");
  const close = () => {
    setStep("idle");
    setName("");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep("oath");
  };

  const acceptOath = () => {
    createQuest.mutate({ studentName: name.trim() }, {
      onSuccess: () => {
        toast({
          title: "Quest Begun",
          description: "Your quest has begun. You have been entrusted with one sacred pencil. You must return it before the 54-minute journey ends.",
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
            Continue to the Oath
          </button>
        </form>
      </Dialog>

      {/* Step 2: The Oath */}
      <Dialog isOpen={step === "oath"} onClose={close} title="The Binding Oath">
        <div className="text-center space-y-8">
          <p className="text-xl leading-relaxed text-foreground font-serif italic">
            "Do you swear to return the <strong className="text-primary font-display">Pencil of Power</strong> before the bell tolls in <strong className="text-primary">54 minutes</strong>?"
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
  const { isOverdue } = getQuestStatus(quest.startTime, null);

  const handleReturn = () => {
    returnQuest.mutate(quest.id, {
      onSuccess: (updatedQuest) => {
        const status = getQuestStatus(updatedQuest.startTime, updatedQuest.returnedAt);
        if (status.isOverdue) {
          toast({
            variant: "destructive",
            title: "Quest Failed",
            description: "🔴 ⚠️ The quest has failed. The Pencil of Power has not returned before the bell. The Eye of the Teacher is watching.",
            className: "bg-destructive border-red-500 text-white font-display text-lg py-6",
            duration: 8000,
          });
        } else {
          toast({
            title: "Quest Completed",
            description: "🟢 You have completed your quest with honor. The Fellowship thanks you.",
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
        isOverdue ? 'animate-pulse-red' : 'border-gold hover-glow'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 pointer-events-none">
        <PenTool className="w-32 h-32 transform rotate-45" />
      </div>

      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-display font-bold text-foreground mb-1 truncate">
          {quest.studentName}
        </h3>
        <p className="text-sm text-muted-foreground">
          Departed: {quest.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="mb-8 relative z-10 p-4 bg-background/50 rounded-lg border border-border">
        <LiveTimer startTime={quest.startTime} />
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
