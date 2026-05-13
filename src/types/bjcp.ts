export interface NumericStat {
  min: number | null;
  max: number | null;
  raw: string;
}

export interface VitalStatistics {
  og: NumericStat;
  fg: NumericStat;
  ibu: NumericStat;
  srm: NumericStat;
  abv: NumericStat;
}

export interface BJCPStyle {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  overall_impression: string;
  aroma: string;
  appearance: string;
  flavor: string;
  mouthfeel: string;
  comments: string;
  history: string;
  ingredients: string;
  comparison: string;
  entry_instructions: string;
  vital_statistics: VitalStatistics;
  commercial_examples: string[];
  tags: string[];
}
