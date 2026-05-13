"use client";

import React, { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { BJCPStyle } from "@/types/bjcp";
import { findBeerMatches, MatchmakerPreferences, MatchResult } from "@/utils/matchmaker_engine";
import GlassRenderer from "@/components/GlassRenderer";

interface BeerMatchmakerProps {
  isOpen: boolean;
  onClose: () => void;
  styles: BJCPStyle[];
  lang: "es" | "en";
  onSelectStyle: (style: BJCPStyle) => void;
}

export default function BeerMatchmaker({
  isOpen,
  onClose,
  styles,
  lang,
  onSelectStyle,
}: BeerMatchmakerProps) {
  
  // Steps: 0: ABV, 1: Color, 2: Profile, 3: Flavors, 4: Results
  const [currentStep, setCurrentStep] = useState(0);

  // Selections State
  const [prefs, setPrefs] = useState<MatchmakerPreferences>({
    abvLevel: "any",
    colorPreference: "any",
    maltLevel: "any",
    flavors: [],
  });

  // UI Copy dictionary
  const t = {
    es: {
      title: "🔮 Asistente de Recomendación",
      next: "Siguiente",
      back: "Atrás",
      finish: "Buscar Almas Gemelas",
      restart: "Comenzar de Nuevo",
      close: "Cerrar",
      matchPercent: "Coincidencia",
      whyMatch: "Por qué encaja:",
      viewDetail: "Ver Ficha Técnica",
      steps: [
        {
          title: "¿Qué tan fuerte te gusta?",
          subtitle: "Volumen alcohólico (ABV) deseado",
          options: [
            { value: "low", label: "Session / Ligera (< 4.5%)", desc: "Para beber varias sin prisa." },
            { value: "medium", label: "Estándar (4.5% - 7.5%)", desc: "El balance de pub clásico." },
            { value: "high", label: "Fuerte / Intensa (> 7.5%)", desc: "Para disfrutar lento y saborear." },
            { value: "any", label: "No me importa el alcohol", desc: "Me rige el sabor únicamente." },
          ]
        },
        {
          title: "¿Qué tonalidad prefieres?",
          subtitle: "Preferencia cromática visual",
          options: [
            { value: "pale", label: "Clara / Dorada", desc: "Luminosa, pajiza y brillante.", color: "#FFE699" },
            { value: "amber", label: "Ámbar / Cobriza", desc: "Caramelo, rojiza y tostada.", color: "#C45C24" },
            { value: "dark", label: "Oscura / Negra", desc: "Profunda, opaca y opulenta.", color: "#1A0B00" },
            { value: "any", label: "Cualquier color", desc: "En vaso de metal sabe igual.", color: "transparent" },
          ]
        },
        {
          title: "¿Cómo prefieres el balance?",
          subtitle: "Duelo entre Maltas y Lúpulos",
          options: [
            { value: "malty", label: "Maltosa / Dulce", desc: "Notas a pan, galleta o miel." },
            { value: "balanced", label: "Equilibrada", desc: "El punto medio armonioso." },
            { value: "hoppy", label: "Amarga / Lupulada", desc: "Cítrica, resinosa y retadora." },
            { value: "any", label: "Me abro a sugerencias", desc: "Sorpréndeme sin filtros." },
          ]
        },
        {
          title: "Agrega sabores preferidos",
          subtitle: "Selecciona los que te llamen la atención (múltiples)",
          flavors: [
            { id: "roasted", label: "☕ Tostado / Café" },
            { id: "fruity", label: "🍑 Frutal / Plátano" },
            { id: "spicy", label: "🌶️ Especiado / Clavo" },
            { id: "sour", label: "🍋 Ácido / Agrio" },
            { id: "crisp", label: "❄️ Refrescante / Limpio" },
          ]
        }
      ]
    },
    en: {
      title: "🔮 Sensory Recommendation Wizard",
      next: "Next Step",
      back: "Back",
      finish: "Find Soulmates",
      restart: "Start Over",
      close: "Close",
      matchPercent: "Match",
      whyMatch: "Why it fits:",
      viewDetail: "View Full Spec",
      steps: [
        {
          title: "How strong do you like it?",
          subtitle: "Desired alcohol volume (ABV)",
          options: [
            { value: "low", label: "Session / Light (< 4.5%)", desc: "To drink multiple pints slowly." },
            { value: "medium", label: "Standard (4.5% - 7.5%)", desc: "The classic pub balance." },
            { value: "high", label: "Strong / Intense (> 7.5%)", desc: "To sip and savor intently." },
            { value: "any", label: "Alcohol level doesn't matter", desc: "Focus solely on flavors." },
          ]
        },
        {
          title: "What visual tone do you prefer?",
          subtitle: "Chromatic visual preference",
          options: [
            { value: "pale", label: "Pale / Golden", desc: "Bright, straw and brilliant.", color: "#FFE699" },
            { value: "amber", label: "Amber / Copper", desc: "Caramel, reddish and toasted.", color: "#C45C24" },
            { value: "dark", label: "Dark / Black", desc: "Deep, opaque and opulent.", color: "#1A0B00" },
            { value: "any", label: "Any visual density", desc: "Tastes good regardless.", color: "transparent" },
          ]
        },
        {
          title: "How do you prefer the balance?",
          subtitle: "The duel of Malts vs Hops",
          options: [
            { value: "malty", label: "Malty / Sweeter", desc: "Bread, biscuit or honey notes." },
            { value: "balanced", label: "Perfectly Balanced", desc: "Harmonious middle ground." },
            { value: "hoppy", label: "Bitter / Hop-forward", desc: "Citrusy, piney and aggressive." },
            { value: "any", label: "Open to suggestions", desc: "Surprise me completely." },
          ]
        },
        {
          title: "Add favorite flavor directions",
          subtitle: "Select any that call to you (multiple)",
          flavors: [
            { id: "roasted", label: "☕ Roasted / Coffee" },
            { id: "fruity", label: "🍑 Fruity / Banana" },
            { id: "spicy", label: "🌶️ Spicy / Clove" },
            { id: "sour", label: "🍋 Sour / Acidic" },
            { id: "crisp", label: "❄️ Refreshing / Crisp" },
          ]
        }
      ]
    }
  }[lang];

  // Compute results ONLY when reaching final step
  const matchingResults = useMemo(() => {
    if (currentStep !== 4) return [];
    return findBeerMatches(styles, prefs, lang);
  }, [currentStep, styles, prefs, lang]);

  const resetWizard = () => {
    setPrefs({
      abvLevel: "any",
      colorPreference: "any",
      maltLevel: "any",
      flavors: [],
    });
    setCurrentStep(0);
  };

  const toggleFlavor = (flavorId: string) => {
    setPrefs((prev) => {
      const isSelected = prev.flavors.includes(flavorId);
      const nextFlavors = isSelected
        ? prev.flavors.filter((f) => f !== flavorId)
        : [...prev.flavors, flavorId];
      return { ...prev, flavors: nextFlavors };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
      <div className="py-4">
        
        {/* Step Progress Dots */}
        {currentStep < 4 && (
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === currentStep 
                    ? "w-8 bg-pilsner-gold" 
                    : step < currentStep 
                      ? "w-3 bg-pilsner-gold/40" 
                      : "w-3 bg-white/10"
                }`}
              />
            ))}
          </div>
        )}

        {/* ─── STEP 0: ABV ─── */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold tracking-tight">{t.steps[0].title}</h3>
              <p className="text-sm opacity-60">{t.steps[0].subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.steps[0].options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrefs({ ...prefs, abvLevel: opt.value as any })}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col gap-1 ${
                    prefs.abvLevel === opt.value
                      ? "bg-pilsner-gold/20 border-pilsner-gold shadow-md"
                      : "bg-white/5 border-white/10 hover:border-pilsner-gold/30"
                  }`}
                >
                  <span className="font-bold text-base text-foreground">{opt.label}</span>
                  <span className="text-xs opacity-60 leading-relaxed">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 1: COLOR ─── */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold tracking-tight">{t.steps[1].title}</h3>
              <p className="text-sm opacity-60">{t.steps[1].subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.steps[1].options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrefs({ ...prefs, colorPreference: opt.value as any })}
                  className={`p-5 rounded-2xl text-left border transition-all flex items-center gap-4 ${
                    prefs.colorPreference === opt.value
                      ? "bg-pilsner-gold/20 border-pilsner-gold shadow-md"
                      : "bg-white/5 border-white/10 hover:border-pilsner-gold/30"
                  }`}
                >
                  {"color" in opt && opt.color && opt.color !== "transparent" ? (
                    <div 
                      className="w-8 h-8 rounded-full border border-white/20 shadow-sm flex-shrink-0" 
                      style={{ backgroundColor: opt.color }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-dashed border-white/40 flex-shrink-0 flex items-center justify-center text-xs">?</div>
                  )}
                  <div>
                    <div className="font-bold text-base text-foreground">{opt.label}</div>
                    <div className="text-xs opacity-60 leading-relaxed">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 2: PROFILE ─── */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold tracking-tight">{t.steps[2].title}</h3>
              <p className="text-sm opacity-60">{t.steps[2].subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.steps[2].options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrefs({ ...prefs, maltLevel: opt.value as any })}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col gap-1 ${
                    prefs.maltLevel === opt.value
                      ? "bg-pilsner-gold/20 border-pilsner-gold shadow-md"
                      : "bg-white/5 border-white/10 hover:border-pilsner-gold/30"
                  }`}
                >
                  <span className="font-bold text-base text-foreground">{opt.label}</span>
                  <span className="text-xs opacity-60 leading-relaxed">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 3: FLAVORS ─── */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold tracking-tight">{t.steps[3].title}</h3>
              <p className="text-sm opacity-60">{t.steps[3].subtitle}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {t.steps[3].flavors?.map((flv) => {
                const isSel = prefs.flavors.includes(flv.id);
                return (
                  <button
                    key={flv.id}
                    onClick={() => toggleFlavor(flv.id)}
                    className={`px-6 py-4 rounded-full font-semibold text-base transition-all border flex items-center gap-2 ${
                      isSel
                        ? "bg-pilsner-gold text-stout-dark border-pilsner-gold shadow-lg shadow-pilsner-gold/20 active:scale-[0.96]"
                        : "bg-white/5 text-foreground/80 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {flv.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STEP 4: RESULTS ALMAS GEMELAS ─── */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-extrabold tracking-tight">🍻 {lang === "es" ? "¡Tus Almas Gemelas Encontradas!" : "Your Perfect Beer Soulmates!"}</h3>
              <p className="text-sm opacity-60">{lang === "es" ? "Basado en tu huella sensorial, estos estilos te fascinarán." : "Based on your sensory footprint, you will love these styles."}</p>
            </div>

            {matchingResults.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-3xl border-dashed border-white/20">
                <p className="text-lg opacity-75">🙁 {lang === "es" ? "No encontramos perfiles que encajen." : "No matching profiles found."}</p>
                <p className="text-sm opacity-60 mt-1">{lang === "es" ? "Intenta relajando las selecciones de sabores." : "Try relaxing some flavor choices."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchingResults.slice(0, 3).map((res, i) => {
                  const avgSrm = res.style.vital_statistics.srm.min
                    ? (res.style.vital_statistics.srm.min + res.style.vital_statistics.srm.max!) / 2
                    : 2;
                  
                  return (
                    <div key={res.style.id} className="glass-card relative rounded-3xl p-5 flex flex-col items-center border border-white/10 text-center hover:border-pilsner-gold/40 transition-all">
                      
                      {/* Top Medal */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold uppercase bg-pilsner-gold text-stout-dark shadow-md tracking-widest flex items-center gap-1">
                        {i === 0 ? "🏆 Top Match" : `# ${i + 1}`}
                      </div>

                      {/* Glass rendering */}
                      <div className="my-6">
                        <GlassRenderer srm={avgSrm} appearanceText={res.style.appearance} size="md" />
                      </div>

                      {/* Match Score */}
                      <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-mono font-bold border border-green-500/30 mb-3">
                        ⚡ {res.score}% {t.matchPercent}
                      </div>

                      <h4 className="text-base font-extrabold leading-tight line-clamp-2 min-h-[2.5rem]">
                        {res.style.id}. {res.style.name}
                      </h4>

                      {/* Why reasons */}
                      <div className="mt-4 w-full text-left text-xs opacity-75 space-y-1 border-t border-white/10 pt-3 flex-1">
                        <span className="block font-bold opacity-50 mb-1">{t.whyMatch}</span>
                        {res.matchingReasons.map((reason, ri) => (
                          <div key={ri} className="flex items-center gap-1">
                            <span className="text-green-400">✓</span> {reason}
                          </div>
                        ))}
                      </div>

                      {/* View detail action */}
                      <button
                        onClick={() => {
                          onSelectStyle(res.style);
                        }}
                        className="w-full mt-5 py-2 rounded-xl bg-pilsner-gold/10 hover:bg-pilsner-gold text-pilsner-gold hover:text-stout-dark font-bold text-xs uppercase tracking-wider border border-pilsner-gold/30 transition-all active:scale-[0.98]"
                      >
                        {t.viewDetail}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── NAVIGATION BUTTONS (FOOTER) ─── */}
        <div className="mt-8 flex justify-between border-t border-white/5 pt-5">
          {currentStep > 0 && currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-5 py-2 text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity"
            >
              ← {t.back}
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t.next} →
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3 rounded-xl bg-pilsner-gold text-stout-dark font-extrabold text-sm shadow-lg shadow-pilsner-gold/25 tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              ✨ {t.finish}
            </button>
          )}

          {currentStep === 4 && (
            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={resetWizard}
                className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold transition-colors"
              >
                🔄 {t.restart}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-extrabold shadow-md hover:opacity-90 transition-opacity"
              >
                {t.close}
              </button>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}
