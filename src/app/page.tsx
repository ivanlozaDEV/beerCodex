"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Search, 
  Brain, 
  BarChart3, 
  Sparkles, 
  Beer, 
  Compass, 
  ShieldCheck,
  Award,
  Milestone,
  SlidersHorizontal,
  Palette,
  Globe,
  User,
  MapPin,
  BookmarkCheck,
  Activity,
  Mail
} from "lucide-react";
import VisitorCounter from "@/components/ui/VisitorCounter";

// Bulletproof inline SVG for Instagram to avoid Lucide-version issues
const Instagram = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Home() {
  const [lang, setLang] = useState<"es" | "en">("es");

  // Animation variants for staggered children reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 110, damping: 20 }
    }
  };

  // Definitive localized copy dictionary from user spec
  const t = {
    es: {
      // HERO
      headline: "El Códice de las Cervezas",
      tagline: "La enciclopedia interactiva de los más de 120 estilos y 34 categorías BJCP 2021 — con Asesor Sensorial Wizard, comparador multilateral y renderizado visual exacto del color de cada cerveza.",
      shortDesc: "Creado para entusiastas, homebrewers y apasionados del sector. Filtra por amargor, alcohol y color. Deja que el Wizard encuentre tu cerveza ideal. Compara estilos cara a cara.",
      chips: ["+120 Estilos BJCP", "34 Categorías", "Guía bilingüe", "Asesor Wizard", "Gratis"],
      ctaExplore: "Explorar el Códice",
      ctaMatch: "¿Cuál es mi cerveza?",
      
      // FEATURES
      featuresHeading: "Todo lo que necesitas para conocer la cerveza en profundidad",
      features: [
        {
          title: "Búsqueda difusa instantánea",
          desc: 'Escribe "chocolate", "frutal" o "IPA" y encuentra en milisegundos cualquier estilo por nombre, aroma, sabor o historia.',
          icon: Search
        },
        {
          title: "Filtros paramétricos",
          desc: "Desliza rangos de ABV (0–20%), IBU (0–150) y SRM con barra visual de tonalidades en tiempo real.",
          icon: SlidersHorizontal
        },
        {
          title: "Asesor sensorial Wizard",
          desc: "Un asistente en 3 pasos que traduce tus preferencias de sabor en las 3 cervezas perfectas para ti, con porcentaje de afinidad.",
          icon: Brain
        },
        {
          title: "Comparador multilateral",
          desc: "Pon hasta 4 estilos uno al lado del otro y compara ABV, IBU, SRM, OG, FG y ejemplos comerciales de una sola vista.",
          icon: BarChart3
        },
        {
          title: "Renderizado de color exacto",
          desc: "Cada estilo muestra su color real en un vaso virtual, con turbidez dinámica según la descripción física del estilo.",
          icon: Palette
        },
        {
          title: "Bilingüe nativo",
          desc: "Cambia entre español e inglés al instante, con las 34 categorías BJCP 2021 traducidas con precisión técnica.",
          icon: Globe
        }
      ],

      // ABOUT
      aboutHeading: "Sobre el Creador",
      creatorTitle: "Maestro Cervecero • Cervecería Cúspide — Guayaquil, Ecuador",
      creatorBioShort: "El Códice nació de la pasión de Iván Loza, maestro cervecero de Cervecería Cúspide (Guayaquil, Ecuador), por llevar el conocimiento técnico de los estilos cerveceros a cualquier persona — sin importar si eres homebrewer, consumidor curioso o estudioso de la guía BJCP.",
      creatorBioExtended: "Desarrollado por Iván Loza, maestro cervecero en activo en Cervecería Cúspide (Guayaquil, Ecuador). El Códice es un proyecto personal nacido de la necesidad de tener una referencia técnica, visual e interactiva de los más de 120 estilos de la guía BJCP 2021 — completamente alineada, bilingüe y al alcance de todos.",
      
      // FOOTER
      footerCredit: "Creado por Iván Loza • Maestro Cervecero, Cervecería Cúspide • Guayaquil, Ecuador",
      visitorLive: "En vivo — visitas registradas desde el lanzamiento",
      
      // CLOSING
      closingHeadline: "Tu próxima cerveza favorita está a un clic.",
      closingBody: "Explora los estilos, deja que el Wizard te conozca o compara tus favoritos. El Códice está siempre disponible, sin registro, sin costo.",
      closingBtn: "Entrar al Códice"
    },
    en: {
      // HERO
      headline: "The Beer Codex",
      tagline: "The interactive encyclopedia of 120+ styles and 34 categories of BJCP 2021 — with Sensory Wizard matching, multilateral comparison, and pixel-accurate color rendering for every beer.",
      shortDesc: "Built for enthusiasts, homebrewers, and beer passionate minds. Filter by bitterness, alcohol, and color. Let the Wizard find your perfect beer. Compare styles side by side.",
      chips: ["120+ BJCP Styles", "34 Categories", "Bilingual guide", "Sensory Wizard", "Free"],
      ctaExplore: "Explore the Codex",
      ctaMatch: "What's my beer?",
      
      // FEATURES
      featuresHeading: "Everything you need to truly understand beer",
      features: [
        {
          title: "Instant fuzzy search",
          desc: 'Type "chocolate", "fruity" or "IPA" and find any style in milliseconds — searching names, aromas, flavors, and history.',
          icon: Search
        },
        {
          title: "Parametric filters",
          desc: "Slide ABV (0–20%), IBU (0–150), and SRM ranges with a real-time visual color bar.",
          icon: SlidersHorizontal
        },
        {
          title: "Sensory Wizard advisor",
          desc: "A 3-step wizard that translates your flavor preferences into your top 3 perfect beer matches, with an affinity score.",
          icon: Brain
        },
        {
          title: "Multilateral comparator",
          desc: "Line up to 4 styles and compare ABV, IBU, SRM, OG, FG, and commercial examples in a single view.",
          icon: BarChart3
        },
        {
          title: "Exact color rendering",
          desc: "Every style displays its true liquid color in a virtual glass, with dynamic haziness based on the style's physical description.",
          icon: Palette
        },
        {
          title: "Fully bilingual",
          desc: "Switch between Spanish and English instantly, with all 34 BJCP 2021 categories translated with technical precision.",
          icon: Globe
        }
      ],

      // ABOUT
      aboutHeading: "About the Creator",
      creatorTitle: "Master Brewer • Cervecería Cúspide — Guayaquil, Ecuador",
      creatorBioShort: "The Codex was born from the passion of Iván Loza — master brewer at Cervecería Cúspide (Guayaquil, Ecuador) — to make the technical knowledge of beer styles accessible to everyone, whether you're a homebrewer, a curious drinker, or studying the BJCP guidelines.",
      creatorBioExtended: "Developed by Iván Loza, an active master brewer at Cervecería Cúspide in Guayaquil, Ecuador. The Codex is a personal project born from the need for a fully technical, visual, and interactive reference covering all 120+ styles in the BJCP 2021 guidelines — 100% aligned, bilingual, and free for everyone.",
      
      // FOOTER
      footerCredit: "Created by Iván Loza • Master Brewer, Cervecería Cúspide • Guayaquil, Ecuador",
      visitorLive: "Live — visits recorded since launch",
      
      // CLOSING
      closingHeadline: "Your next favorite beer is one click away.",
      closingBody: "Browse the styles, let the Wizard get to know you, or compare your favorites. The Codex is always on — no sign-up, no cost.",
      closingBtn: "Enter the Codex"
    }
  }[lang];

  return (
    <div className="min-h-screen flex flex-col bg-brand-navy font-sans overflow-x-hidden selection:bg-brand-gold selection:text-brand-navy text-brand-cream">
      
      {/* Fixed Glowing Core Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none select-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none select-none" />

      {/* Brand Navigation with Language Switcher state connected */}
      <Navbar lang={lang} setLang={setLang} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative flex-1 flex items-center py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-brand-gold/10">
        
        {/* Topographic Lines Accents */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="#F2B705" strokeWidth="0.2">
            <path d="M -20 30 Q 20 50 50 20 T 120 40" />
            <path d="M -20 35 Q 20 55 50 25 T 120 45" />
            <path d="M -20 40 Q 20 60 50 30 T 120 50" />
            <path d="M -20 70 Q 40 50 70 80 T 130 60" />
            <path d="M -20 75 Q 40 55 70 85 T 130 65" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Hero Copy block */}
          <motion.div 
            key={lang} // Key triggers complete re-animation cascading on language change
            className="flex flex-col max-w-xl text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-5">
              <span className="w-6 h-[1px] bg-brand-gold" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-brand-gold">
                {lang === "es" ? "Cerveza que nace de la pasión" : "Beer born from passion"}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-brand-cream leading-[1.05] mb-6"
            >
              {t.headline}<span className="text-brand-gold">.</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-brand-cream font-extrabold leading-relaxed mb-4 border-l-2 border-brand-gold/35 pl-4 bg-brand-gold/[0.02]"
            >
              {t.tagline}
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-sm text-brand-cream/75 font-medium leading-relaxed mb-8"
            >
              {t.shortDesc}
            </motion.p>

            {/* Dynamic Context Chips */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-10">
              {t.chips.map((chip, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-[10px] font-black text-brand-gold/90 uppercase tracking-widest">
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons Block */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link href="/styles" className="group bg-brand-gold text-brand-navy px-8 py-4 rounded-2xl font-black uppercase tracking-[0.12em] text-sm shadow-xl shadow-brand-gold/15 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all">
                <span>{t.ctaExplore}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/styles" className="group border border-white/15 hover:border-white/30 bg-white/[0.03] text-brand-cream px-8 py-4 rounded-2xl font-black uppercase tracking-[0.12em] text-sm flex items-center justify-center gap-3 hover:bg-white/[0.07] active:scale-95 transition-all">
                <span>{t.ctaMatch}</span>
                <Sparkles className="w-4 h-4 text-brand-gold" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero 3D visual Float */}
          <motion.div 
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="absolute w-72 h-72 rounded-full bg-brand-gold/10 blur-[64px] -z-10 animate-pulse-slow" />
            
            <motion.div 
              className="relative w-68 sm:w-76 aspect-[1/2] bg-[#07111a] rounded-[3rem] border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between group cursor-pointer"
              whileHover={{ scale: 1.04, rotateY: -5, rotateX: 5, boxShadow: "0 25px 50px -12px rgba(242, 183, 5, 0.15)" }}
              animate={{ y: [0, -12, 0] }}
              transition={{ 
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                hover: { duration: 0.3 }
              }}
              style={{ perspective: 1000 }}
            >
              {/* Full Photo Background (Cúspide Brewery Landscape Photo) */}
              <img 
                src="/fotocuspide.png" 
                alt="Cervecería Cúspide Paisaje" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0 select-none pointer-events-none" 
              />

              {/* Soft Cinematic Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[1] pointer-events-none" />
              
              {/* ENLARGED Can Logo Block - Beautifully Floating Brand Overlay */}
              <div className="flex flex-col items-center mt-8 relative z-10 group-hover:scale-105 transition-transform duration-500 w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] px-6">
                <img 
                  src="/logo-cuspide.png" 
                  alt="Cervecería Cúspide Logo" 
                  className="w-full max-w-[180px] h-auto object-contain filter brightness-125 contrast-115" 
                />
                <a 
                  href="https://instagram.com/cerveceriacuspide" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-brand-gold mt-4 hover:text-brand-cream transition-colors drop-shadow-lg cursor-pointer z-20"
                >
                  <Instagram className="w-3 h-3" />
                  <span>@cerveceriacuspide</span>
                </a>
              </div>

              {/* UI Overlay Style Block - Floating on bottom like Phone UI */}
              <div className="flex flex-col items-center relative z-10 mb-8 drop-shadow-lg w-full">
                <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-3xl px-6 py-5 flex flex-col items-center max-w-[85%] shadow-2xl">
                  <span className="text-4xl font-black uppercase tracking-[0.2em] text-brand-cream leading-none mb-3">IPA</span>
                  <div className="flex items-center gap-2 text-[9px] font-extrabold tracking-[0.15em] uppercase text-brand-gold">
                    <span>6.5% ABV</span>
                    <span className="w-1 h-1 rounded-full bg-brand-gold animate-pulse" />
                    <span>60 IBU</span>
                  </div>
                </div>
              </div>

              {/* Absolute Can Tag (UI Badge) */}
              <div className="absolute -top-1 right-8 bg-brand-gold text-brand-navy text-[9px] font-black px-4 py-2 rounded-b-xl tracking-[0.2em] uppercase shadow-lg z-20">
                PRO
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ─── FEATURES SECTION (Clean Cream Theme) ─── */}
      <section className="bg-brand-cream text-brand-navy py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div 
            className="max-w-3xl mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
              <BookmarkCheck className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-brand-gold">
                {lang === "es" ? "Características" : "Features"}
              </span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-navy mb-6 leading-tight">
              {t.featuresHeading}
            </motion.h2>
          </motion.div>

          {/* 6-Grid Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-brand-navy/5 shadow-xl shadow-brand-navy/[0.02] group flex flex-col hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-navy/[0.05] transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 shadow-md transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wide mb-3 text-brand-navy">
                    {f.title}
                  </h3>
                  <p className="text-sm text-brand-navy/75 font-medium leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── ABOUT THE CREATOR SECTION ─── */}
      <section className="bg-brand-navy py-28 px-4 sm:px-6 lg:px-8 relative border-t border-b border-white/5 overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-brand-gold/[0.03] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            className="bg-[#09121d]/95 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/[0.08] shadow-2xl shadow-black/40 relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              
              {/* Premium Image Avatar - Crazy Llamingo */}
              <div className="flex-shrink-0 flex flex-col items-center text-center group/avatar">
                <div className="relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-[#0d1b2a] to-[#060c15] border border-brand-gold/25 shadow-2xl shadow-black/60 overflow-hidden rotate-3 group-hover/avatar:rotate-0 transition-all duration-500 select-none flex items-center justify-center p-2">
                    <img 
                      src="/crazy-llamingo.png" 
                      alt="Crazy Llamingo - Iván Loza" 
                      className="w-full h-full object-contain group-hover/avatar:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  {/* Active status dot badge overlay */}
                  <div className="absolute -bottom-1.5 -right-1.5 bg-brand-navy border-2 border-white/10 rounded-2xl p-2 shadow-xl">
                    <Beer className="w-5 h-5 text-brand-gold animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-xl font-black mt-6 tracking-wide text-brand-cream">Iván Loza</h3>
                <p className="text-[10px] font-black text-brand-gold/85 uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5 justify-center">
                  <MapPin className="w-3 h-3" />
                  Guayaquil, EC
                </p>
              </div>

              {/* Narrative Block */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-brand-gold opacity-80" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-gold">
                    {t.aboutHeading}
                  </span>
                </div>
                
                <h4 className="text-md font-extrabold text-brand-cream/90 leading-relaxed mb-6 border-b border-white/5 pb-4 uppercase tracking-wide">
                  {t.creatorTitle}
                </h4>

                <p className="text-[15px] text-brand-cream/85 leading-relaxed font-medium mb-6">
                  {t.creatorBioShort}
                </p>
                
                <p className="text-xs text-brand-cream/60 leading-relaxed font-medium italic bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  {t.creatorBioExtended}
                </p>

                {/* Suggestions/Contact Link Pills */}
                <div className="mt-6 flex flex-wrap gap-3 justify-start">
                  {/* Mail Button */}
                  <a 
                    href="mailto:ivanlozadev@gmail.com" 
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-brand-gold/25 bg-brand-gold/[0.04] hover:bg-brand-gold/[0.1] text-brand-gold text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 cursor-pointer select-none group"
                    title="Enviar sugerencias o comentarios a Iván Loza"
                  >
                    <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>{lang === "es" ? "Sugerencias: ivanlozadev@gmail.com" : "Suggestions: ivanlozadev@gmail.com"}</span>
                  </a>

                  {/* Instagram Button */}
                  <a 
                    href="https://instagram.com/cerveceriacuspide" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-brand-gold/25 bg-brand-gold/[0.04] hover:bg-brand-gold/[0.1] text-brand-gold text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 cursor-pointer select-none group"
                    title="Seguir a Cervecería Cúspide en Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>@cerveceriacuspide</span>
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA / CLOSING SECTION ─── */}
      <section className="bg-brand-cream text-brand-navy py-24 px-4 relative text-center overflow-hidden">
        
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center mb-6 text-brand-gold">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          
          <motion.h2 
            className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-navy mb-6 leading-tight"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.closingHeadline}
          </motion.h2>

          <motion.p 
            className="text-[15px] sm:text-base text-brand-navy/75 font-semibold max-w-xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {t.closingBody}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <Link href="/styles" className="group bg-brand-gold text-brand-navy px-10 py-4.5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm shadow-2xl shadow-brand-gold/20 flex items-center justify-center gap-3 hover:brightness-105 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all">
              <span>{t.closingBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER STRIP (Corporate Premium) ─── */}
      <footer className="bg-brand-navy border-t border-white/10 pt-20 pb-12 px-4 text-brand-cream relative overflow-hidden">
        
        {/* Small tooltip block for visitor API tracking */}
        <div className="w-full flex flex-col items-center justify-center mb-12 gap-4 relative z-10 select-none">
          <div className="flex items-center gap-2.5 text-[9px] font-black tracking-[0.2em] uppercase text-brand-gold/60 border border-brand-gold/10 px-3 py-1 rounded-full bg-brand-gold/5">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{t.visitorLive}</span>
          </div>
          <VisitorCounter />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 border-t border-white/5 pt-12">
          
          <p className="text-xs text-brand-cream/50 font-black uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto mb-8 select-none">
            {t.footerCredit}
          </p>

          <p className="text-[9px] text-brand-cream/30 font-extrabold uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} BJCP Interactive Codex • Norte Cerveza Artesanal • Cúspide
          </p>
        </div>
      </footer>
    </div>
  );
}
