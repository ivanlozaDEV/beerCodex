/**
 * High-fidelity SRM to Hex color mapping based on official brewing color charts.
 * Accurate representation of standard beer colors ranging from 1 to 40+.
 */
export const SRM_COLORS: Record<number, string> = {
  1: "#FFF2B2", // Very pale straw
  2: "#F8E497", // Warm pale straw
  3: "#F1D16E", // Rich straw
  4: "#ECC449", // Pale gold
  5: "#E1AF36", // Deep gold
  6: "#D1982D", // Pale amber
  7: "#CB9D06", // Medium amber
  8: "#C18E17", // Amber
  9: "#B8801D", // Deep amber
  10: "#AF7320", // Copper
  11: "#A66822", // Deep copper
  12: "#9E5D22", // Light brown
  13: "#965322", // Medium brown
  14: "#8E4922", // Brown
  15: "#864021", // Dark brown
  16: "#7F3821", // Very dark brown
  17: "#783020",
  18: "#71291E",
  19: "#6B231E",
  20: "#641C1D", // Blackish-brown
  21: "#5E161C",
  22: "#58101B",
  23: "#520B1A",
  24: "#4C0619",
  25: "#470119",
  26: "#420018",
  27: "#3C0017",
  28: "#370016",
  29: "#320015",
  30: "#2D0014", // Black
  31: "#270013",
  32: "#220012",
  33: "#1D0011",
  34: "#18000F",
  35: "#13000D",
  36: "#0E000C",
  37: "#090008",
  38: "#050005",
  39: "#020002",
  40: "#000000",
};

/**
 * Converts an SRM value to a high-fidelity CSS hex color string.
 * Performs graceful approximation for decimals and bounds checking.
 */
export function getSRMColor(srm: number | null | undefined): string {
  if (srm === null || srm === undefined || isNaN(srm)) {
    return "rgba(255, 255, 255, 0.1)"; // Gray transparent fallback
  }

  const rounded = Math.max(1, Math.min(40, Math.round(srm)));
  return SRM_COLORS[rounded] || "#000000";
}

/**
 * Determines if a given SRM represents a light, medium, or dark beer.
 * Useful for adjusting text contrast inside SRM-colored elements.
 */
export function getSRMContrastColor(srm: number | null | undefined): string {
  if (!srm || srm < 15) {
    return "#1C130C"; // Dark text for light beers
  }
  return "#FDFBF7"; // Light text for dark beers
}
