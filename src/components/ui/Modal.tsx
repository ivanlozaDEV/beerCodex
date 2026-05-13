"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: "default" | "wide"; 
}

export function Modal({ isOpen, onClose, title, children, size = "default" }: ModalProps) {
  // Body scroll-lock
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

  // Handle ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop Glass Layer */}
          <motion.div 
            className="absolute inset-0 bg-stout-black/75 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dynamic Floating Modal Box */}
          <motion.div 
            className={`glass-modal w-full max-h-[90vh] rounded-3xl flex flex-col overflow-hidden z-10 shadow-2xl shadow-black/40 ${
              size === "wide" ? "max-w-[96vw] xl:max-w-7xl" : "max-w-3xl"
            }`}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 28,
              mass: 1
            }}
          >
            {/* Premium Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-white/10 relative bg-background/20 backdrop-blur-sm select-none">
              <div className="flex-1 min-w-0 font-semibold tracking-tight text-foreground">
                {title}
              </div>
              <button
                onClick={onClose}
                className="p-2 ml-4 rounded-2xl bg-white/5 hover:bg-brand-gold hover:text-brand-navy transition-all text-foreground/60 hover:shadow-md active:scale-90 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Body View */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
