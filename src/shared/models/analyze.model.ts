import { BasePlugin } from "../../plugins/analyze-plugin";
import { ParseError } from "@babel/parser";

export type AnalyzedEntityLabels = Record<string, string | boolean | undefined>;

export type AnalyzedEntityMetrics = Record<string, number | undefined>;

type BaseLabels = AnalyzedEntityLabels & {
  fileName: string;
  filePath: string;
  fileContents: string;
};

type BaseMetrics = AnalyzedEntityMetrics & {
  loc: number;
};

export type BaseAnalyzeInfo = PluginAnalyzedEntity & {
  labels: BaseLabels;
  metrics: BaseMetrics;
  type: "file";
  path: string;
};

export interface PluginAnalyzedEntity {
  type: string;
  path: string;
  metrics?: AnalyzedEntityMetrics;
  labels?: AnalyzedEntityLabels;
}

export interface AnalyzedEntity {
  analyzed: PluginAnalyzedEntity;
  baseInfo: BaseAnalyzeInfo;
}

export interface AnalyzeResultItem {
  plugin: BasePlugin;
  data: AnalyzedEntity[];
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
