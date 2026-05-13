import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true, ...props }: CardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 transition-all duration-300 ease-out ${
        hover 
          ? "hover:-translate-y-1 hover:shadow-xl hover:shadow-pilsner-gold/5 hover:border-pilsner-gold/30 active:scale-[0.98]" 
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
