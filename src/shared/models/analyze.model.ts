import { AnalyzerPlugin } from "./plugin.model";

export type AnalyzedEntityLabels = Record<string, string | boolean | undefined>;

export type AnalyzedEntityMetrics = Record<string, number | undefined>;

export interface AnalyzedEntity {
  metrics: AnalyzedEntityMetrics;
  labels: AnalyzedEntityLabels;
}

export interface AnalyzeResultItem {
  plugin: AnalyzerPlugin;
  result: AnalyzedEntity[];
}

export type AnalyzeResults = AnalyzeResultItem[];
