"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: React.ReactNode;
  className?: string;
}

export function Dropdown({ options, selectedValue, onChange, label, className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find((opt) => opt.value === selectedValue) || options[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {label && <span className="block text-xs font-medium opacity-60 mb-1 ml-1">{label}</span>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium glass-card hover:bg-white/5 border-white/10 hover:border-pilsner-gold/50 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-pilsner-gold/50 active:scale-[0.98]"
      >
        <span>{activeOption ? activeOption.label : "Select option"}</span>
        <svg
          className={`ml-2 w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 right-0 mt-2 w-full min-w-[160px] rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden glass-modal animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  option.value === selectedValue
                    ? "bg-pilsner-gold/20 text-pilsner-gold font-semibold"
                    : "text-foreground/80 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
