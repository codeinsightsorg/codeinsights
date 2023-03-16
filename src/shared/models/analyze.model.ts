import { BasePlugin } from "../../plugins/analyze-plugin";

export type AnalyzedEntityLabels = Record<string, string | boolean | undefined>;

export type AnalyzedEntityMetrics = Record<string, number | undefined>;

export interface AnalyzedEntity {
  metrics?: AnalyzedEntityMetrics;
  labels?: AnalyzedEntityLabels;
}

export interface AnalyzeResultItem {
  plugin: BasePlugin;
  result: AnalyzedEntity[];
}

export type AnalyzeResults = AnalyzeResultItem[];
