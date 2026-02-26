import { Link, useLocation } from "wouter";
import { Scroll, PenTool, Flame } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-gold bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-display text-gold-gradient">
                Fellowship of the Pencil
              </h1>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all font-semibold ${
                  location === "/" 
                    ? "text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <PenTool className="w-5 h-5" />
                <span className="hidden sm:inline">Active Quests</span>
              </Link>
              <Link 
                href="/scroll" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all font-semibold ${
                  location === "/scroll" 
                    ? "text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <Scroll className="w-5 h-5" />
                <span className="hidden sm:inline">The Scroll</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>
      
      <footer className="py-8 border-t border-gold/30 mt-auto">
        <p className="text-center text-muted-foreground font-display text-sm">
          One Pencil to rule them all, One Pencil to find them, One Pencil to bring them all, and in the darkness write them.
        </p>
      </footer>
    </div>
  );
}
