// A simplified, beautiful custom Dialog tailored to the theme
// (Replacing default Shadcn dialog for complete aesthetic control)
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
      <div 
        className="fixed inset-0 transition-opacity bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div 
        className="relative z-50 inline-block w-full max-w-lg p-8 overflow-hidden text-left align-middle transition-all transform bg-card border border-gold shadow-2xl rounded-xl animate-in"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {title && (
          <h3 className="mb-6 text-2xl text-center text-gold-gradient font-display">
            {title}
          </h3>
        )}
        
        {children}
      </div>
    </div>
  );
}
