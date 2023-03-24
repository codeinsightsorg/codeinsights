import { BasePlugin } from "../../plugins/analyze-plugin";
import { ParseError } from "@babel/parser";

export type AnalyzedEntityLabels = Record<string, string | boolean | undefined>;

export type AnalyzedEntityMetrics = Record<string, number | undefined>;

export interface BaseAnalyzeInfo {
  file: {
    path: string;
    name: string;
    contents: string;
  };
}
export interface PluginAnalyzedEntity {
  type: string;
  path: string;
  metrics?: AnalyzedEntityMetrics;
  labels?: AnalyzedEntityLabels;
}

export interface AnalyzedEntity {
  result: PluginAnalyzedEntity;
  baseInformation: BaseAnalyzeInfo;
}

export interface AnalyzeResultItem {
  plugin: BasePlugin;
  result: AnalyzedEntity[];
}

type FilePath = string;

export type BaseFileInfoMap = Record<FilePath, BaseAnalyzeInfo>;

export type AnalyzeResults = {
  results: AnalyzeResultItem[];
  parsingErrors: ParsingError[];
};

export interface ParsingError {
  error: ParseError;
  fileName: string;
  fullPath: string;
}
