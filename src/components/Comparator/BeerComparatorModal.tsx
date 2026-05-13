"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { BJCPStyle } from "@/types/bjcp";
import GlassRenderer from "@/components/GlassRenderer";
import { getSRMColor, getSRMContrastColor } from "@/utils/srm_converter";

interface BeerComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  styles: BJCPStyle[];
  lang: "es" | "en";
}

export default function BeerComparatorModal({
  isOpen,
  onClose,
  styles,
  lang,
}: BeerComparatorModalProps) {
  
  const t = {
    es: {
      title: "📊 Matriz Comparativa de Estudio",
      empty: "Selecciona al menos 2 cervezas para comenzar la comparación.",
      remove: "Remover",
      sections: {
        appearance: "Vasos y Tonalidades",
        name: "Nombre de Estilo",
        technical: "Estadísticas Técnicas (Stats)",
        sensory: "Perfil Sensorial",
        culture: "Contexto Cultural e Ingredientes",
      },
      attributes: {
        abv: "Alcohol (ABV)",
        ibu: "Amargor (IBU)",
        srm: "Color (SRM)",
        og: "Gravedad Original (OG)",
        fg: "Gravedad Final (FG)",
        impression: "Impresión General",
        aroma: "Aroma",
        flavor: "Sabor",
        mouthfeel: "Sensación en Boca",
        appearanceText: "Descripción Visual",
        history: "Historia y Origen",
        comparison: "Comparación",
        ingredients: "Ingredientes Clave",
        commercial: "Ejemplos Comerciales",
      }
    },
    en: {
      title: "📊 Comparative Study Matrix",
      empty: "Select at least 2 beers to start the technical comparison.",
      remove: "Remove",
      sections: {
        appearance: "Visual Vessels & Tones",
        name: "Style Name",
        technical: "Technical Statistics",
        sensory: "Sensory Profile",
        culture: "Cultural Context & Ingredients",
      },
      attributes: {
        abv: "Alcohol (ABV)",
        ibu: "Bitterness (IBU)",
        srm: "Color (SRM)",
        og: "Original Gravity (OG)",
        fg: "Final Gravity (FG)",
        impression: "Overall Impression",
        aroma: "Aroma",
        flavor: "Flavor",
        mouthfeel: "Mouthfeel",
        appearanceText: "Visual Appearance",
        history: "History & Origin",
        comparison: "Style Comparison",
        ingredients: "Key Ingredients",
        commercial: "Commercial Examples",
      }
    }
  }[lang];

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t.title}
      size="wide"
    >
      <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
        {styles.length < 2 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center opacity-60">
            <span className="text-5xl mb-4">⚖️</span>
            <h3 className="text-lg font-bold">{t.empty}</h3>
          </div>
        ) : (
          <div 
            className="min-w-[800px] grid gap-y-4 text-sm mt-2"
            style={{
              gridTemplateColumns: `200px repeat(${styles.length}, minmax(240px, 1fr))`
            }}
          >
            
            {/* ─── ROW 1: GLASSES RENDERED ─── */}
            <div className="sticky left-0 z-20 bg-background border-r border-white/10 pr-4 font-bold tracking-widest uppercase opacity-60 flex items-center select-none shadow-[4px_0_12px_-2px_rgba(0,0,0,0.1)]">
              {t.sections.appearance}
            </div>
            {styles.map((style) => {
              const avgSrm = style.vital_statistics.srm.min 
                ? (style.vital_statistics.srm.min + style.vital_statistics.srm.max!) / 2 
                : 2;
              return (
                <div key={style.id} className="flex justify-center py-4 bg-black/10 rounded-t-3xl mx-2">
                  <GlassRenderer srm={avgSrm} appearanceText={style.appearance} size="md" />
                </div>
              );
            })}

            {/* ─── ROW 2: STYLE HEADER & ID ─── */}
            <div className="sticky left-0 z-20 bg-background border-r border-white/10 pr-4 font-bold tracking-widest uppercase opacity-60 flex items-center select-none shadow-[4px_0_12px_-2px_rgba(0,0,0,0.1)]">
              {t.sections.name}
            </div>
            {styles.map((style) => (
              <div key={style.id} className="px-4 py-3 bg-black/10 border-b border-white/5 text-center mx-2 flex flex-col justify-center">
                <span className="font-mono text-xs inline-block bg-pilsner-gold/20 text-pilsner-gold px-3 py-0.5 rounded-full w-max mx-auto mb-1.5 font-bold">
                  {style.id}
                </span>
                <h4 className="font-extrabold text-base text-foreground leading-tight">
                  {style.name}
                </h4>
                {style.category_name && (
                  <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1.5 font-bold text-pilsner-gold flex-shrink-0">
                    Cat. {style.category_id}: {style.category_name}
                  </p>
                )}
              </div>
            ))}

            {/* SECTION BREAK: TECHNICAL STATS */}
            <div className="col-span-full py-3 font-extrabold tracking-widest uppercase text-pilsner-gold border-b border-pilsner-gold/20 text-xs mt-6">
              ⚡ {t.sections.technical}
            </div>

            {/* TECHNICAL ROWS GENERATION HELPER */}
            {[
              { label: t.attributes.abv, key: "abv", suffix: "%", highlight: true },
              { label: t.attributes.ibu, key: "ibu", suffix: "", highlight: true },
              { label: t.attributes.srm, key: "srm", suffix: "", srmStyle: true },
              { label: t.attributes.og, key: "og", suffix: "", highlight: false },
              { label: t.attributes.fg, key: "fg", suffix: "", highlight: false },
            ].map((row) => (
              <React.Fragment key={row.key}>
                <div className="sticky left-0 z-20 bg-background border-r border-b border-white/10 pr-4 font-bold flex items-center opacity-90 select-none shadow-[4px_0_12px_-2px_rgba(0,0,0,0.1)] min-h-[3rem]">
                  {row.label}
                </div>
                {styles.map((style) => {
                  const stat = (style.vital_statistics as any)[row.key];
                  const display = stat?.min ? `${stat.min}${row.suffix} – ${stat.max}${row.suffix}` : "N/A";
                  
                  return (
                    <div key={style.id} className="px-4 py-3.5 bg-white/[0.02] text-center mx-2 font-mono font-bold border-b border-white/5 flex justify-center items-center">
                      {row.srmStyle && stat?.min ? (
                        <div 
                          className="px-4 py-1.5 rounded-xl shadow-sm text-sm"
                          style={{
                            backgroundColor: getSRMColor((stat.min + stat.max) / 2),
                            color: getSRMContrastColor(stat.min)
                          }}
                        >
                          {display}
                        </div>
                      ) : (
                        <span className={`text-base ${row.highlight ? "text-pilsner-gold font-black" : "opacity-90"}`}>
                          {display}
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* SECTION BREAK: SENSORY PROFILE */}
            <div className="col-span-full py-3 font-extrabold tracking-widest uppercase text-pilsner-gold border-b border-pilsner-gold/20 text-xs mt-8">
              🧠 {t.sections.sensory}
            </div>

            {/* SENSORY ROWS GENERATION HELPER */}
            {[
              { label: t.attributes.impression, key: "overall_impression", italic: true, highlightText: true },
              { label: t.attributes.aroma, key: "aroma" },
              { label: t.attributes.flavor, key: "flavor" },
              { label: t.attributes.appearanceText, key: "appearance" },
              { label: t.attributes.mouthfeel, key: "mouthfeel" },
            ].map((row) => (
              <React.Fragment key={row.key}>
                <div className="sticky left-0 z-20 bg-background border-r border-b border-white/10 pr-4 font-bold flex items-start pt-4 opacity-90 select-none shadow-[4px_0_12px_-2px_rgba(0,0,0,0.1)]">
                  {row.label}
                </div>
                {styles.map((style) => {
                  const text = (style as any)[row.key];
                  return (
                    <div key={style.id} className="px-4 py-4 bg-white/[0.01] mx-2 border-b border-white/5 text-xs leading-relaxed">
                      {text ? (
                        <p className={`${row.italic ? "italic font-medium" : "opacity-85"} ${row.highlightText ? "text-pilsner-gold/90" : ""}`}>
                          {row.highlightText ? `"${text}"` : text}
                        </p>
                      ) : (
                        <span className="opacity-30 font-mono">N/A</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* SECTION BREAK: CULTURE & NARRATIVE */}
            <div className="col-span-full py-3 font-extrabold tracking-widest uppercase text-pilsner-gold border-b border-pilsner-gold/20 text-xs mt-8">
              🌾 {t.sections.culture}
            </div>

            {/* NARRATIVE ROWS */}
            {[
              { label: t.attributes.comparison, key: "comparison" },
              { label: t.attributes.ingredients, key: "ingredients" },
              { label: t.attributes.history, key: "history" },
              { label: t.attributes.commercial, key: "commercial_examples", isArray: true },
            ].map((row) => (
              <React.Fragment key={row.key}>
                <div className="sticky left-0 z-20 bg-background border-r border-b border-white/10 pr-4 font-bold flex items-start pt-4 opacity-90 select-none shadow-[4px_0_12px_-2px_rgba(0,0,0,0.1)]">
                  {row.label}
                </div>
                {styles.map((style) => {
                  const val = (style as any)[row.key];
                  
                  if (row.isArray) {
                    return (
                      <div key={style.id} className="px-4 py-4 bg-white/[0.015] mx-2 border-b border-white/5 flex flex-col gap-1.5 justify-start">
                        {Array.isArray(val) && val.length > 0 ? (
                          val.map((item: string, idx: number) => (
                            <span key={idx} className="text-[11px] font-bold px-3 py-1.5 bg-foreground/[0.06] text-foreground border border-foreground/10 rounded-xl shadow-sm text-center truncate max-w-full leading-tight" title={item}>
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="opacity-30 font-mono text-center text-xs py-2">N/A</span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={style.id} className="px-4 py-4 bg-white/[0.005] mx-2 border-b border-white/5 text-xs leading-relaxed opacity-80">
                      {val || <span className="opacity-30 font-mono">N/A</span>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

          </div>
        )}
      </div>
    </Modal>
  );
}
