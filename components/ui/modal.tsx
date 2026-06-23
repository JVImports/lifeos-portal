import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-6 relative shadow-2xl bg-[#1d2027]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface/60 hover:text-on-surface transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-[#424754]/20 pb-3">
          <h3 className="text-lg font-bold text-on-surface">{title}</h3>
        </div>

        {children}
      </div>
    </div>
  );
}
