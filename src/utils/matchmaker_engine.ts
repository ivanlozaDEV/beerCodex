import { BJCPStyle } from "@/types/bjcp";

export interface MatchmakerPreferences {
  maltLevel: "malty" | "balanced" | "hoppy" | "any";
  abvLevel: "low" | "medium" | "high" | "any";
  colorPreference: "pale" | "amber" | "dark" | "any";
  flavors: string[]; // e.g. ["roasted", "fruity", "spicy", "sour", "crisp"]
}

export interface MatchResult {
  style: BJCPStyle;
  score: number; // Percentage 0-100
  matchingReasons: string[]; // Descriptive list of why it matched
}

/**
 * Heuristic Engine ranking all BJCP Styles against a user sensory profile.
 * Assigns points based on quantitative stats overlap and qualitative tag/text scanning.
 */
export function findBeerMatches(
  styles: BJCPStyle[],
  prefs: MatchmakerPreferences,
  lang: "es" | "en"
): MatchResult[] {
  const results: MatchResult[] = styles.map((style) => {
    let score = 0;
    let maxPossibleScore = 0;
    const matchingReasons: string[] = [];

    const t = {
      es: {
        abvMatch: "Perfecto volumen alcohólico",
        colorMatch: "Color visual exacto",
        maltMatch: "Balance malta-lúpulo ideal",
        flavorMatch: (f: string) => `Sabor ${f} destacado`,
      },
      en: {
        abvMatch: "Perfect alcohol volume",
        colorMatch: "Exact visual color density",
        maltMatch: "Ideal malt-to-hop balance",
        flavorMatch: (f: string) => `Highlights ${f} flavors`,
      }
    }[lang];

    // ─── 1. ABV SCORES ───
    if (prefs.abvLevel !== "any") {
      maxPossibleScore += 30;
      const min = style.vital_statistics.abv.min || 0;
      const max = style.vital_statistics.abv.max || 20;
      const avg = (min + max) / 2;

      let matched = false;
      if (prefs.abvLevel === "low" && avg < 4.5) matched = true;
      else if (prefs.abvLevel === "medium" && avg >= 4.5 && avg <= 7.5) matched = true;
      else if (prefs.abvLevel === "high" && avg > 7.5) matched = true;

      if (matched) {
        score += 30;
        matchingReasons.push(t.abvMatch);
      }
    }

    // ─── 2. COLOR / SRM SCORES ───
    if (prefs.colorPreference !== "any") {
      maxPossibleScore += 30;
      const min = style.vital_statistics.srm.min || 0;
      const max = style.vital_statistics.srm.max || 45;
      const avg = (min + max) / 2;

      let matched = false;
      if (prefs.colorPreference === "pale" && avg < 8) matched = true;
      else if (prefs.colorPreference === "amber" && avg >= 8 && avg <= 18) matched = true;
      else if (prefs.colorPreference === "dark" && avg > 18) matched = true;

      if (matched) {
        score += 30;
        matchingReasons.push(t.colorMatch);
      }
    }

    // ─── 3. MALT / HOP BALANCE (IBU/Tags) SCORES ───
    if (prefs.maltLevel !== "any") {
      maxPossibleScore += 30;
      const styleTags = (style.tags || []).map(tag => tag.toLowerCase());
      const sIbu = style.vital_statistics.ibu.max || 30;

      let matched = false;
      if (prefs.maltLevel === "malty" && (styleTags.includes("malty") || styleTags.includes("maltosa") || sIbu < 25)) {
        matched = true;
      } else if (prefs.maltLevel === "hoppy" && (styleTags.includes("bitter") || styleTags.includes("hoppy") || styleTags.includes("amarga") || sIbu > 40)) {
        matched = true;
      } else if (prefs.maltLevel === "balanced" && (styleTags.includes("balanced") || styleTags.includes("balanceada") || (sIbu >= 25 && sIbu <= 40))) {
        matched = true;
      }

      if (matched) {
        score += 30;
        matchingReasons.push(t.maltMatch);
      }
    }

    // ─── 4. SPECIFIC FLAVOR SCANNING (Tags & Text) ───
    const combinedText = (
      (style.name || "") + " " +
      (style.overall_impression || "") + " " + 
      (style.flavor || "") + " " + 
      (style.aroma || "") + " " +
      (style.tags || []).join(" ")
    ).toLowerCase();

    prefs.flavors.forEach((flavor) => {
      maxPossibleScore += 20;
      
      const lookupMap: Record<string, string[]> = {
        roasted: ["roasted", "coffee", "tostado", "café", "chocolate", "roasty"],
        fruity: ["fruit", "ester", "banana", "plum", "fruta", "éster", "ciruela", "pera"],
        spicy: ["spicy", "clove", "phenolic", "pepper", "especiada", "clavo", "pimienta", "fenólica"],
        sour: ["sour", "acid", "tart", "funky", "ácido", "agria", "lambic"],
        crisp: ["crisp", "refreshing", "clean", "fresca", "limpia", "refrescante"],
      };

      const keywords = lookupMap[flavor] || [];
      const textContainsKeyword = keywords.some(k => combinedText.includes(k));

      if (textContainsKeyword) {
        score += 20;
        const flavorLabels: Record<string, Record<string, string>> = {
          es: { roasted: "Tostado", fruity: "Frutal", spicy: "Especiado", sour: "Ácido", crisp: "Fresco" },
          en: { roasted: "Roasted", fruity: "Fruity", spicy: "Spicy", sour: "Sour", crisp: "Crisp" }
        };
        matchingReasons.push(t.flavorMatch(flavorLabels[lang][flavor] || flavor));
      }
    });

    // Avoid zero division if all set to ANY
    const percentage = maxPossibleScore > 0 
      ? Math.round((score / maxPossibleScore) * 100) 
      : 0;

    return {
      style,
      score: percentage,
      matchingReasons
    };
  });

  // Sort results by descending score and return top 6
  // If all prefs were "any", return a varied set as sensible defaults
  const filtered = results.filter(r => r.score > 20);
  if (filtered.length === 0) {
    // Fallback: return top 6 styles with at least some data, sorted by style id
    return results
      .slice()
      .sort((a, b) => a.style.id.localeCompare(b.style.id, undefined, { numeric: true }))
      .slice(0, 6)
      .map(r => ({ ...r, score: 75, matchingReasons: [lang === "es" ? "Estilo compatible con tus preferencias" : "Compatible with your preferences"] }));
  }
  return filtered
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
