"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  lang?: "es" | "en";
  setLang?: (lang: "es" | "en") => void;
}

export default function Navbar({ lang = "es", setLang }: NavbarProps) {
  const pathname = usePathname();

  const t = {
    es: {
      home: "Inicio",
      codex: "Guía de Estilos",
      matchmaker: "Matchmaker",
      cta: "Explorar Códice"
    },
    en: {
      home: "Home",
      codex: "Styles Guide",
      matchmaker: "Matchmaker",
      cta: "Explore Codex"
    }
  }[lang];

  return (
    <nav className="sticky top-0 z-[100] w-full bg-brand-navy/90 border-b border-brand-gold/20 backdrop-blur-md shadow-lg shadow-brand-navy/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all text-brand-gold">
              <span className="text-lg font-bold group-hover:scale-110 transition-transform">⚔️</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-[0.1em] text-brand-cream group-hover:text-brand-gold transition-colors uppercase">
                BJCP
              </span>
              <span className="font-medium text-[9px] tracking-[0.25em] text-brand-gold uppercase mt-0.5">
                Interactive Codex
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                pathname === "/" ? "text-brand-gold" : "text-brand-cream/70 hover:text-brand-gold"
              }`}
            >
              {t.home}
            </Link>
            <Link 
              href="/styles"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                pathname.startsWith("/styles") ? "text-brand-gold" : "text-brand-cream/70 hover:text-brand-gold"
              }`}
            >
              {t.codex}
            </Link>
          </div>

          {/* Actions: Language & CTA */}
          <div className="flex items-center gap-4">
            
            {/* Integrated Language Toggle inside Navbar */}
            {setLang && (
              <div className="flex items-center bg-brand-blue/50 border border-white/10 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setLang("es")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all cursor-pointer ${
                    lang === "es"
                      ? "bg-brand-gold text-brand-navy shadow-md active:scale-95"
                      : "text-brand-cream/60 hover:text-brand-cream"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all cursor-pointer ${
                    lang === "en"
                      ? "bg-brand-gold text-brand-navy shadow-md active:scale-95"
                      : "text-brand-cream/60 hover:text-brand-cream"
                  }`}
                >
                  EN
                </button>
              </div>
            )}

            {pathname !== "/styles" && (
              <Link 
                href="/styles"
                className="bg-brand-gold text-brand-navy px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                {t.cta}
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
