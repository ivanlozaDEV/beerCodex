import React from "react";
import { getSRMColor } from "@/utils/srm_converter";

interface GlassRendererProps {
  srm: number | null | undefined;
  appearanceText?: string;
  size?: "sm" | "md" | "lg";
}

export default function GlassRenderer({ srm, appearanceText = "", size = "md" }: GlassRendererProps) {
  // Dimensions mapping
  const sizeClasses = {
    sm: "w-16 h-24",
    md: "w-28 h-40",
    lg: "w-36 h-52",
  };

  const foamHeightClasses = {
    sm: "h-3",
    md: "h-5",
    lg: "h-7",
  };

  const baseColor = getSRMColor(srm);
  
  // Scan appearance text for Haze/Clarity
  const scanText = appearanceText.toLowerCase();
  const isOpaque = scanText.includes("opac") || scanText.includes("opaque") || (srm && srm > 30);
  const isHazy = scanText.includes("haz") || scanText.includes("turbi") || scanText.includes("cloudy") || scanText.includes("velada");
  const isBrilliant = scanText.includes("brilliant") || scanText.includes("brillante") || scanText.includes("cristalina");

  // Calculate style overrides based on descriptors
  let opacity = 0.88;
  let internalBlur = "none";
  
  if (isOpaque) {
    opacity = 1;
  } else if (isHazy) {
    opacity = 0.94;
    internalBlur = "blur(1.5px)";
  } else if (isBrilliant) {
    opacity = 0.78;
  }

  return (
    <div className={`relative flex flex-col items-center justify-end select-none group ${sizeClasses[size]}`}>
      
      {/* ─── THE GLASS CONTAINER ─── */}
      <div className="relative w-full h-full overflow-hidden shadow-lg transition-transform duration-500 group-hover:scale-[1.04]"
           style={{
             clipPath: "polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%)",
             borderRadius: "4px 4px 16px 16px",
             border: "2px solid rgba(255, 255, 255, 0.25)",
             background: "rgba(255, 255, 255, 0.04)",
             boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1)",
           }}>
        
        {/* Glass Inner Specular Highlight (Realistic shine) */}
        <div className="absolute left-[10%] top-0 w-[15%] h-full bg-gradient-to-r from-white/30 via-white/5 to-transparent z-20 pointer-events-none" />
        
        {/* ─── THE BEER FOAM / HEAD ─── */}
        <div className={`absolute top-0 w-full z-10 bg-foam-cream ${foamHeightClasses[size]} transition-all duration-300 flex items-center justify-center border-b border-amber-900/10 overflow-hidden`}
             style={{
               opacity: srm ? 1 : 0,
             }}>
          {/* Bubbles texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.1)_1px,_transparent_1px)] bg-[size:6px_6px]" />
          <div className="w-full h-full bg-gradient-to-b from-white via-[#FCFAF5] to-[#EDE9DF]" />
        </div>

        {/* ─── LIQUID COLOR BACKDROP (White lightbox backdrop to ensure absolute color fidelity against dark/navy themes) ─── */}
        <div className="absolute bottom-0 left-0 w-full h-[92%] bg-[#FFFFFF]" />

        {/* ─── THE LIQUID BEER ─── */}
        <div className="absolute bottom-0 left-0 w-full h-[92%] transition-all duration-700 ease-out origin-bottom"
             style={{
               backgroundColor: baseColor,
               opacity: opacity,
               filter: internalBlur,
             }}>
          
          {/* Carbonation Effect (Subtle rising bubbles using repeating radial-gradient) */}
          {!isOpaque && (
            <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay animate-pulse bg-[radial-gradient(circle_at_50%_100%,_#fff_1px,_transparent_2px)] bg-[size:20px_40px]" 
                 style={{
                   animationDuration: "3s"
                 }}
            />
          )}
          
          {/* Realistic Liquid Gradients (Dark sides, light core) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          
          {/* Liquid Core glow (Simulates light scattering) */}
          <div className="absolute inset-[10%] top-[20%] rounded-full bg-white/10 blur-md mix-blend-screen opacity-40" />

          {/* Haze Fog Overlay */}
          {isHazy && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5 mix-blend-screen pointer-events-none" />
          )}
        </div>
      </div>
      
      {/* Glass Foot / Shadow */}
      <div className="w-[70%] h-2 mt-[-2px] rounded-full bg-black/30 blur-[3px] group-hover:opacity-80 group-hover:blur-[4px] transition-all duration-500" />
    </div>
  );
}
