import Fuse from "fuse.js";
import { BJCPStyle } from "@/types/bjcp";

export function createSearchEngine(styles: BJCPStyle[]) {
  const options = {
    includeScore: true,
    threshold: 0.35, // Delicate balance for fuzzy search matching
    keys: [
      { name: "id", weight: 0.9 },
      { name: "name", weight: 0.8 },
      { name: "category_name", weight: 0.7 },
      { name: "tags", weight: 0.6 },
      { name: "commercial_examples", weight: 0.5 },
      { name: "overall_impression", weight: 0.4 },
      { name: "flavor", weight: 0.3 },
      { name: "aroma", weight: 0.3 },
    ],
  };

  const fuse = new Fuse(styles, options);
  
  return {
    search: (query: string): BJCPStyle[] => {
      if (!query || query.trim() === "") return styles;
      const results = fuse.search(query);
      return results.map(r => r.item);
    }
  };
}
