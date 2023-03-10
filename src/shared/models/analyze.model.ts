export type AnalyzedEntityLabels = Record<string, string | boolean | undefined>;

export type AnalyzedEntityMetrics = Record<string, number | undefined>;

export interface AnalyzedEntity {
  metrics: AnalyzedEntityMetrics;
  labels: AnalyzedEntityLabels;
}

export interface AnalyzeResultItem {
  id: string;
  result: AnalyzedEntity[];
}

export type AnalyzeResults = AnalyzeResultItem[];
