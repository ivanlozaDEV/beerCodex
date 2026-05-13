"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  SlidersHorizontal, 
  Scale, 
  Sparkles, 
  Brain, 
  Info, 
  ChevronRight, 
  RotateCcw,
  Zap,
  Check,
  Plus,
  Layers,
  Percent,
  Palette,
  Flame,
  FlaskConical,
  BarChart3
} from "lucide-react";

import VisitorCounter from "@/components/ui/VisitorCounter";

// Components
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Dropdown, DropdownOption } from "@/components/ui/Dropdown";
import GlassRenderer from "@/components/GlassRenderer";
import BeerMatchmaker from "@/components/Matchmaker/BeerMatchmaker";
import BeerComparatorModal from "@/components/Comparator/BeerComparatorModal";
import Navbar from "@/components/ui/Navbar";

// Data
import esStylesData from "@/data/styles_es.json";
import enStylesData from "@/data/styles_en.json";

// Types & Utilities
import { BJCPStyle } from "@/types/bjcp";
import { createSearchEngine } from "@/utils/search_engine";
import { getSRMColor, getSRMContrastColor } from "@/utils/srm_converter";

// Cast imported data to strict interface
const esStyles = esStylesData as unknown as BJCPStyle[];
const enStyles = enStylesData as unknown as BJCPStyle[];

export default function StylesDashboard() {
  // Hydration mounting guard
  const [mounted, setMounted] = useState(false);

  // Core State
  const [lang, setLang] = useState<"es" | "en">("es");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Parameter Filters
  const [abvRange, setAbvRange] = useState<[number, number]>([0, 20]);
  const [ibuRange, setIbuRange] = useState<[number, number]>([0, 150]);
  const [srmRange, setSrmRange] = useState<[number, number]>([0, 45]);
  
  // Active Detail State (For modal rendering)
  const [activeStyle, setActiveStyle] = useState<BJCPStyle | null>(null);
  
  // Matchmaker Wizard Toggle State
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);

  // Comparator Toggle & Selection State
  const [selectedForComparison, setSelectedForComparison] = useState<BJCPStyle[]>([]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Language Switcher Config
  const langOptions: DropdownOption[] = [
    { value: "es", label: "🇪🇸 Español" },
    { value: "en", label: "🇺🇸 English" },
  ];

  // Dynamic Text Mappings
  const t = {
    es: {
      title: "BJCP Interactivo",
      subtitle: "El Códice Cervecero Moderno",
      searchPlaceholder: "Buscar aroma, sabor, estilo...",
      abv: "Alcohol (ABV)",
      ibu: "Amargor (IBU)",
      srm: "Color (SRM)",
      resetFilters: "Limpiar Filtros",
      stats: "Estadísticas Vitales",
      commercial: "Ejemplos Comerciales",
      tags: "Etiquetas",
      ingredients: "Ingredientes",
      impression: "Impresión General",
      aroma: "Aroma",
      appearance: "Apariencia",
      flavor: "Sabor",
      mouthfeel: "Sensación en Boca",
      history: "Historia",
      comparison: "Comparación de Estilo",
      resultsCount: (n: number) => `Mostrando ${n} estilos`,
      matchmakerBtn: "🔮 Encuentra tu Estilo",
    },
    en: {
      title: "BJCP Interactive",
      subtitle: "The Modern Beer Codex",
      searchPlaceholder: "Search aroma, flavor, style...",
      abv: "Alcohol (ABV)",
      ibu: "Bitterness (IBU)",
      srm: "Color (SRM)",
      resetFilters: "Reset Filters",
      stats: "Vital Statistics",
      commercial: "Commercial Examples",
      tags: "Tags",
      ingredients: "Ingredients",
      impression: "Overall Impression",
      aroma: "Aroma",
      appearance: "Appearance",
      flavor: "Flavor",
      mouthfeel: "Mouthfeel",
      history: "History",
      comparison: "Style Comparison",
      resultsCount: (n: number) => `Showing ${n} styles`,
      matchmakerBtn: "🔮 Find My Match",
    },
  }[lang];

  // Memoize standard dataset based on language
  const activeDataset = useMemo(() => {
    return lang === "es" ? esStyles : enStyles;
  }, [lang]);

  // Memoize high-speed Fuzzy Search engine per active dataset
  const searchEngine = useMemo(() => {
    return createSearchEngine(activeDataset);
  }, [activeDataset]);

  // Perform multi-stage filtering pipeline
  const filteredStyles = useMemo(() => {
    // Step 1: Fuzzy Text Search Filter
    const searched = searchEngine.search(searchQuery);

    // Step 2: Metric Range Computations
    return searched.filter((style) => {
      const sAbv = style.vital_statistics.abv;
      const sIbu = style.vital_statistics.ibu;
      const sSrm = style.vital_statistics.srm;

      // Perform logic checks only if specific item has parsed numeric mins/maxes
      const matchesAbv = 
        sAbv.min === null || sAbv.max === null ||
        (sAbv.min >= abvRange[0] && sAbv.max <= abvRange[1]);

      const matchesIbu = 
        sIbu.min === null || sIbu.max === null ||
        (sIbu.min >= ibuRange[0] && sIbu.max <= ibuRange[1]);

      const matchesSrm = 
        sSrm.min === null || sSrm.max === null ||
        (sSrm.min >= srmRange[0] && sSrm.max <= srmRange[1]);

      return matchesAbv && matchesIbu && matchesSrm;
    });
  }, [searchQuery, searchEngine, abvRange, ibuRange, srmRange]);

  // Detect if any non-default search/filter is currently applied
  const isAnyFilterActive = useMemo(() => {
    return searchQuery.trim().length > 0 || 
           abvRange[0] > 0 || abvRange[1] < 20 ||
           ibuRange[0] > 0 || ibuRange[1] < 150 ||
           srmRange[0] > 0 || srmRange[1] < 45;
  }, [searchQuery, abvRange, ibuRange, srmRange]);

  // Dynamically group filtered beers by Category (e.g. Standard American Beer)
  const groupedStyles = useMemo(() => {
    const groups: { [key: string]: { id: string; name: string; styles: BJCPStyle[] } } = {};
    
    filteredStyles.forEach(style => {
      const catId = style.category_id;
      const catName = style.category_name || (lang === "es" ? `Categoría ${catId}` : `Category ${catId}`);
      
      if (!groups[catId]) {
        groups[catId] = {
          id: catId,
          name: catName,
          styles: []
        };
      }
      groups[catId].styles.push(style);
    });
    
    // Numerically/Alphabetically sort categories (1, 2, 3...)
    return Object.values(groups).sort((a, b) => {
      const aNum = parseInt(a.id, 10);
      const bNum = parseInt(b.id, 10);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [filteredStyles, lang]);

  const toggleComparison = (style: BJCPStyle, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForComparison((prev) => {
      const isSelected = prev.some(s => s.id === style.id);
      if (isSelected) {
        return prev.filter(s => s.id !== style.id);
      }
      if (prev.length >= 4) {
        alert(lang === "es" ? "Máximo 4 cervezas para comparar simultáneamente." : "Maximum 4 beers can be compared at once.");
        return prev;
      }
      return [...prev, style];
    });
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setAbvRange([0, 20]);
    setIbuRange([0, 150]);
    setSrmRange([0, 45]);
  };

  const renderStyleCard = (style: BJCPStyle) => {
    const abvText = style.vital_statistics.abv.min 
      ? `${style.vital_statistics.abv.min}% - ${style.vital_statistics.abv.max}%`
      : "N/A";

    const avgSrm = style.vital_statistics.srm.min 
      ? (style.vital_statistics.srm.min + (style.vital_statistics.srm.max ?? style.vital_statistics.srm.min)) / 2 
      : 2;

    const isSelected = selectedForComparison.some(s => s.id === style.id);

    return (
      <motion.div
        key={style.id}
        layout
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        whileHover={{ 
          y: -5, 
          scale: 1.02, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(242, 183, 5, 0.3)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 350, 
          damping: 25,
          layout: { duration: 0.2 }
        }}
        className="h-full"
      >
        <Card
          onClick={() => setActiveStyle(style)}
          className="cursor-pointer h-full flex gap-4 items-center group relative overflow-hidden border border-white/5 transition-colors shine-effect"
        >
          {/* Float Compare Button Top Right */}
          <button
            onClick={(e) => toggleComparison(style, e)}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-xl z-10 flex items-center justify-center border transition-all shadow-sm active:scale-[0.85] cursor-pointer ${
              isSelected
                ? "bg-green-500/20 border-green-400 text-green-400 shadow-green-500/10"
                : "bg-black/20 border-white/10 text-white/50 hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold shadow-md"
            }`}
            title={lang === "es" ? "Añadir a comparativa" : "Add to compare"}
          >
            {isSelected ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            )}
          </button>

          {/* Dynamic Glass Representation */}
          <div className="flex-shrink-0 py-2 filter drop-shadow-md">
            <GlassRenderer 
              srm={avgSrm} 
              appearanceText={style.appearance} 
              size="sm"
            />
          </div>

          {/* Style Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-foreground/10 rounded-lg font-black tracking-wide text-foreground/80">
                {style.id}
              </span>
              <span className="text-[9px] font-black uppercase opacity-50 tracking-[0.1em] truncate">
                Cat. {style.category_id}
              </span>
            </div>
            <h3 className="font-black text-[15px] text-foreground tracking-tight line-clamp-2 leading-tight group-hover:text-brand-gold transition-colors">
              {style.name}
            </h3>
            
            <div className="mt-2.5 flex items-center gap-3 text-xs opacity-75 font-mono font-bold">
              <span className="flex items-center gap-1 text-foreground/80">
                <FlaskConical className="w-3 h-3 text-brand-gold opacity-75" />
                <span>{abvText}</span>
              </span>
              {style.vital_statistics.ibu.min && (
                <span className="flex items-center gap-1 text-foreground/80">
                  <Zap className="w-3 h-3 text-brand-gold opacity-75 fill-brand-gold/20" />
                  <span>{style.vital_statistics.ibu.min}-{style.vital_statistics.ibu.max}</span>
                </span>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-stout-dark text-foam-cream">🍻 Loading Codex...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Brand Navigation Navbar */}
      <Navbar lang={lang} setLang={setLang} />

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 md:p-6 gap-6">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
          <Card hover={false} className="sticky top-24 space-y-6 border-brand-gold/10 shadow-lg">
            
            {/* Sensory Matchmaker Premium Feature Entry */}
            <button
              onClick={() => setIsMatchmakerOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-brand-gold text-brand-navy rounded-2xl font-black tracking-wide shadow-lg shadow-brand-gold/10 transition-all hover:brightness-105 hover:shadow-brand-gold/20 active:scale-[0.97] cursor-pointer group relative overflow-hidden shine-effect"
            >
              <div className="text-left leading-tight flex flex-col relative z-10">
                <span className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-black flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Sensory Wizard
                </span>
                <span className="text-[13px] font-black tracking-tight uppercase flex items-center gap-2">
                  {t.matchmakerBtn.replace("🔮 ", "")}
                  <Brain className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform font-black relative z-10" />
            </button>

            <div className="h-[1px] w-full bg-foreground/5" />

            {/* Search Box */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] uppercase text-foreground/60 mb-2.5">
                <Search className="w-3.5 h-3.5 opacity-75" />
                {lang === "es" ? "Búsqueda Rápida" : "Quick Search"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-foreground/[0.04] hover:bg-foreground/[0.07] focus:bg-background rounded-2xl border border-foreground/10 focus:border-brand-gold text-sm text-foreground placeholder-foreground/35 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Parametric Range Sliders */}
            <div className="space-y-6">
              {/* ABV */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 text-[11px]">
                  <span className="font-black uppercase tracking-widest text-foreground/65 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-brand-gold opacity-80" />
                    {t.abv}
                  </span>
                  <span className="font-mono text-brand-gold font-black bg-brand-gold/10 px-2 py-0.5 rounded-md">{abvRange[0]}% - {abvRange[1]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={abvRange[1]}
                  onChange={(e) => setAbvRange([abvRange[0], parseFloat(e.target.value)])}
                  className="w-full accent-brand-gold cursor-pointer"
                />
              </div>

              {/* IBU */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 text-[11px]">
                  <span className="font-black uppercase tracking-widest text-foreground/65 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-gold opacity-80" />
                    {t.ibu}
                  </span>
                  <span className="font-mono text-brand-gold font-black bg-brand-gold/10 px-2 py-0.5 rounded-md">{ibuRange[0]} - {ibuRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={ibuRange[1]}
                  onChange={(e) => setIbuRange([ibuRange[0], parseInt(e.target.value)])}
                  className="w-full accent-brand-gold cursor-pointer"
                />
              </div>

              {/* SRM */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 text-[11px]">
                  <span className="font-black uppercase tracking-widest text-foreground/65 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-brand-gold opacity-80" />
                    {t.srm}
                  </span>
                  <span className="font-mono text-brand-gold font-black bg-brand-gold/10 px-2 py-0.5 rounded-md">{srmRange[0]} - {srmRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  step="1"
                  value={srmRange[1]}
                  onChange={(e) => setSrmRange([srmRange[0], parseInt(e.target.value)])}
                  className="w-full accent-brand-gold cursor-pointer"
                />
                {/* Color Gradient Bar Helper */}
                <div className="h-1.5 w-full rounded-full mt-3 bg-gradient-to-r from-[#FFE699] via-[#C18E17] via-[#7F3821] to-[#000000] shadow-inner opacity-90" />
              </div>
            </div>

            <button
              onClick={resetAllFilters}
              className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-foreground/10 hover:border-brand-gold hover:bg-brand-gold/5 transition-all text-foreground/75 hover:text-brand-gold hover:shadow-md active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.resetFilters}
            </button>
          </Card>
        </aside>

        {/* ─── STYLE CARDS GRID ─── */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between opacity-60 px-1 text-sm">
            <span>{t.resultsCount(filteredStyles.length)}</span>
          </div>

          {filteredStyles.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-16 text-center glass-card rounded-[2.5rem] border-dashed opacity-75 mt-6"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-gold">
                <Search className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">{lang === "es" ? "Sin coincidencias" : "No styles match filters"}</h3>
              <p className="text-sm text-foreground/60 mt-2 max-w-xs leading-relaxed">{lang === "es" ? "Intenta ampliar los rangos paramétricos de alcohol, amargor o tonalidad" : "Try expanding your alcohol, bitterness or color ranges"}</p>
            </motion.div>
          ) : !isAnyFilterActive ? (
            /* ─── GROUPED CATEGORY VIEW (WHEN FILTERS ARE NOT ACTIVE) ─── */
            <div className="space-y-12 mt-4 pb-20">
              <AnimatePresence mode="popLayout">
                {groupedStyles.map((category) => (
                  <motion.div 
                    key={category.id} 
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >
                    {/* Dynamic Sticky-friendly Premium Category Header */}
                    <div className="flex items-center gap-3.5 border-b border-brand-gold/20 pb-3 pt-2 select-none">
                      <div className="bg-brand-gold text-brand-navy w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black shadow-lg shadow-brand-gold/15">
                        {category.id}
                      </div>
                      <h2 className="text-sm sm:text-base font-black uppercase tracking-[0.12em] text-foreground">
                        {category.name}
                      </h2>
                    </div>
                    
                    {/* Card Grid in staggered animation pathway */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {category.styles.map((style) => renderStyleCard(style))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* ─── FLAT SEARCH GRID VIEW (WHEN FILTERS ARE ACTIVE) ─── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-2 pb-20">
              <AnimatePresence mode="popLayout">
                {filteredStyles.map((style) => renderStyleCard(style))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* ─── HIGH-FIDELITY DETAIL MODAL ─── */}
      <Modal
        isOpen={!!activeStyle}
        onClose={() => setActiveStyle(null)}
        title={
          activeStyle ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pr-8">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono bg-pilsner-gold/20 text-pilsner-gold px-3 py-1 rounded-xl border border-pilsner-gold/30 text-sm font-bold flex-shrink-0">
                  {activeStyle.id}
                </span>
                <span className="text-lg md:text-xl font-black text-foreground truncate">{activeStyle.name}</span>
              </div>
              {activeStyle.category_name && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/50 px-2.5 py-1 bg-foreground/5 rounded-lg border border-foreground/10 w-fit flex-shrink-0 whitespace-nowrap">
                  {activeStyle.category_name}
                </span>
              )}
            </div>
          ) : null
        }
      >
        {activeStyle && (
          <div className="space-y-8 pb-6">
            
            {/* Top Hero Area: Visual Glass + Quick Stats */}
            {/* Top Hero Area: Visual Glass + Full-Width Stats Grid */}
            <div className="flex flex-col gap-6 items-center bg-gradient-to-br from-white/[0.02] to-transparent p-6 sm:p-8 rounded-3xl border border-white/5">
              
              {/* Big visual rendered cup (Centered for focus) */}
              <div className="flex-shrink-0 p-5 bg-black/20 rounded-2xl shadow-inner border border-white/5">
                <GlassRenderer 
                  srm={activeStyle.vital_statistics.srm.min 
                    ? (activeStyle.vital_statistics.srm.min + (activeStyle.vital_statistics.srm.max ?? activeStyle.vital_statistics.srm.min)) / 2 
                    : 2} 
                  appearanceText={activeStyle.appearance}
                  size="md"
                />
              </div>

              {/* Full-Width Technical Specs Grid (Guarantees text never overflows) */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
                
                {/* ABV Pill */}
                <div className="p-3 sm:p-4 rounded-2xl glass-card flex flex-col justify-center min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-50">ABV</span>
                  <span className="text-[14px] sm:text-sm md:text-[15px] font-extrabold mt-1 font-mono text-pilsner-gold whitespace-nowrap tracking-tight px-1">
                    {activeStyle.vital_statistics.abv.min ? `${activeStyle.vital_statistics.abv.min}%-${activeStyle.vital_statistics.abv.max ?? activeStyle.vital_statistics.abv.min}%` : "N/A"}
                  </span>
                </div>

                {/* IBU Pill */}
                <div className="p-3 sm:p-4 rounded-2xl glass-card flex flex-col justify-center min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-50">IBU</span>
                  <span className="text-[14px] sm:text-sm md:text-[15px] font-extrabold mt-1 font-mono text-pilsner-gold whitespace-nowrap tracking-tight px-1">
                    {activeStyle.vital_statistics.ibu.min ? `${activeStyle.vital_statistics.ibu.min}-${activeStyle.vital_statistics.ibu.max}` : "N/A"}
                  </span>
                </div>

                {/* SRM Pill */}
                <div className="p-3 sm:p-4 rounded-2xl glass-card flex flex-col justify-center overflow-hidden relative min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-50 z-10">SRM</span>
                  <span className="text-[14px] sm:text-sm md:text-[15px] font-extrabold mt-1 font-mono z-10 relative whitespace-nowrap px-1"
                        style={{
                          color: activeStyle.vital_statistics.srm.min ? getSRMContrastColor(activeStyle.vital_statistics.srm.min) : 'inherit'
                        }}>
                    {activeStyle.vital_statistics.srm.min ? `${activeStyle.vital_statistics.srm.min}-${activeStyle.vital_statistics.srm.max}` : "N/A"}
                  </span>
                  {activeStyle.vital_statistics.srm.min && (
                    <div className="absolute inset-0 z-0 opacity-90"
                         style={{
                           backgroundColor: getSRMColor((activeStyle.vital_statistics.srm.min + activeStyle.vital_statistics.srm.max!) / 2)
                         }}
                    />
                  )}
                </div>

                {/* OG Pill */}
                <div className="p-3 sm:p-4 rounded-2xl glass-card flex flex-col justify-center min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-50">OG / DI</span>
                  <span className="text-[14px] sm:text-sm md:text-[15px] font-extrabold mt-1 font-mono opacity-90 whitespace-nowrap tracking-tight px-1">
                    {activeStyle.vital_statistics.og.min ? `${activeStyle.vital_statistics.og.min}-${activeStyle.vital_statistics.og.max}` : "N/A"}
                  </span>
                </div>

                {/* FG Pill */}
                <div className="p-3 sm:p-4 rounded-2xl glass-card flex flex-col justify-center min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-50">FG / DF</span>
                  <span className="text-[14px] sm:text-sm md:text-[15px] font-extrabold mt-1 font-mono opacity-90 whitespace-nowrap tracking-tight px-1">
                    {activeStyle.vital_statistics.fg.min ? `${activeStyle.vital_statistics.fg.min}-${activeStyle.vital_statistics.fg.max}` : "N/A"}
                  </span>
                </div>

              </div>
            </div>

            {/* Key Descriptive Tag Pills */}
            {activeStyle.tags && activeStyle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeStyle.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full capitalize opacity-80">
                    # {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Core sensory narrative Blocks */}
            <div className="grid grid-cols-1 gap-6">
              
              {/* IMPRESSION (Standout) */}
              {activeStyle.overall_impression && (
                <div className="bg-pilsner-gold/5 border border-pilsner-gold/20 rounded-2xl p-5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-pilsner-gold mb-2">⚡ {t.impression}</h4>
                  <p className="text-sm leading-relaxed text-foreground font-medium italic">
                    "{activeStyle.overall_impression}"
                  </p>
                </div>
              )}

              {/* SENSORY GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Aroma */}
                {activeStyle.aroma && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">👃 {t.aroma}</h4>
                    <p className="text-sm leading-relaxed opacity-90 bg-foreground/5 rounded-2xl p-4">{activeStyle.aroma}</p>
                  </div>
                )}

                {/* Appearance */}
                {activeStyle.appearance && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">👀 {t.appearance}</h4>
                    <p className="text-sm leading-relaxed opacity-90 bg-foreground/5 rounded-2xl p-4">{activeStyle.appearance}</p>
                  </div>
                )}

                {/* Flavor */}
                {activeStyle.flavor && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">👅 {t.flavor}</h4>
                    <p className="text-sm leading-relaxed opacity-90 bg-foreground/5 rounded-2xl p-4">{activeStyle.flavor}</p>
                  </div>
                )}

                {/* Mouthfeel */}
                {activeStyle.mouthfeel && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">👄 {t.mouthfeel}</h4>
                    <p className="text-sm leading-relaxed opacity-90 bg-foreground/5 rounded-2xl p-4">{activeStyle.mouthfeel}</p>
                  </div>
                )}

              </div>

              {/* HISTORY & CULTURE (Secondary) */}
              <div className="border-t border-white/10 pt-6 space-y-6">
                
                {/* History */}
                {activeStyle.history && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-ale mb-2">📜 {t.history}</h4>
                    <p className="text-sm leading-relaxed opacity-80 bg-white/[0.02] rounded-2xl p-4 border border-white/5">{activeStyle.history}</p>
                  </div>
                )}

                {/* Comparison */}
                {activeStyle.comparison && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">⚖️ {t.comparison}</h4>
                    <p className="text-sm leading-relaxed opacity-80 bg-white/[0.02] rounded-2xl p-4 border border-white/5">{activeStyle.comparison}</p>
                  </div>
                )}

                {/* Ingredients */}
                {activeStyle.ingredients && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-hop-green mb-2">🌾 {t.ingredients}</h4>
                    <p className="text-sm leading-relaxed opacity-80 bg-white/[0.02] rounded-2xl p-4 border border-white/5">{activeStyle.ingredients}</p>
                  </div>
                )}
              </div>

              {/* COMMERCIAL EXAMPLES */}
              {activeStyle.commercial_examples && activeStyle.commercial_examples.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-pilsner-gold mb-3">🛒 {t.commercial}</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeStyle.commercial_examples.map((example, i) => (
                      <span key={i} className="text-xs font-bold px-4 py-2.5 bg-foreground/[0.06] text-foreground border border-foreground/10 rounded-xl shadow-sm hover:bg-pilsner-gold hover:text-brand-navy hover:border-pilsner-gold transition-all cursor-default">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </Modal>

      {/* Sensory Recommendation Matchmaker Wizard */}
      <BeerMatchmaker
        isOpen={isMatchmakerOpen}
        onClose={() => setIsMatchmakerOpen(false)}
        styles={activeDataset}
        lang={lang}
        onSelectStyle={(style) => {
          setIsMatchmakerOpen(false);
          // Slight delay for layered window animation smoothness
          setTimeout(() => {
            setActiveStyle(style);
          }, 350);
        }}
      />

      {/* Floating Comparison Tray */}
      <AnimatePresence>
        {selectedForComparison.length > 0 && (
          <motion.div 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md p-3.5 glass-modal rounded-[2rem] shadow-2xl shadow-black/40 flex items-center justify-between gap-4 border border-brand-gold/30 select-none"
            initial={{ y: 80, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 80, x: "-50%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            
            {/* Selected glasses overview */}
            <div className="flex items-center gap-2 ml-1">
              {selectedForComparison.map((style) => {
                const avgSrm = style.vital_statistics.srm.min 
                  ? (style.vital_statistics.srm.min + style.vital_statistics.srm.max!) / 2 
                  : 2;
                return (
                  <motion.div 
                    key={style.id} 
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="relative group h-10 w-8 flex items-end justify-center"
                  >
                    <GlassRenderer srm={avgSrm} size="sm" />
                    {/* Quick remove overlay */}
                    <button 
                      onClick={(e) => toggleComparison(style, e)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Core Trigger button */}
            <button
              onClick={() => setIsComparatorOpen(true)}
              disabled={selectedForComparison.length < 2}
              className={`flex-1 py-2.5 px-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-md relative overflow-hidden group ${
                selectedForComparison.length >= 2
                  ? "bg-brand-gold text-brand-navy hover:brightness-105 active:scale-[0.96] cursor-pointer shadow-brand-gold/10"
                  : "bg-foreground/[0.05] text-foreground/30 border border-foreground/5 cursor-not-allowed"
              }`}
            >
              <BarChart3 className={`w-4 h-4 transition-transform group-hover:scale-110 ${selectedForComparison.length >= 2 ? "text-brand-navy" : "opacity-30"}`} />
              <span>{lang === "es" ? "Comparar" : "Compare"} ({selectedForComparison.length})</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beer Comparative Matrix Modal */}
      <BeerComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        styles={selectedForComparison}
        lang={lang}
      />
      {/* Footer Strip */}
      <footer className="w-full border-t border-foreground/5 mt-16 py-8 flex flex-col items-center gap-3.5 relative z-10 opacity-80">
        <VisitorCounter />
        <p className="text-[9px] text-foreground/30 font-black uppercase tracking-[0.25em]">
          BJCP Interactive Codex • Cervecería Cúspide
        </p>
      </footer>
    </div>
  );
}
