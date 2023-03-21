import { BasePlugin } from "../../plugins/analyze-plugin";
import { ParseError } from "@babel/parser";

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

export type AnalyzeResults = {
  results: AnalyzeResultItem[];
  parsingErrors: ParsingError[];
};

export interface ParsingError {
  error: ParseError;
  fileName: string;
  fullPath: string;
}
