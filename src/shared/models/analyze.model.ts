import { BasePlugin } from "../../modules/analyzer/plugin-analyzer/analyze-plugin";

export type AnalyzedEntityLabels = Record<string, string | boolean | undefined>;

export type AnalyzedEntityMetrics = Record<string, number | undefined>;

type BaseLabels = AnalyzedEntityLabels & {
  fileName: string;
  filePath: string;
  fileContents: string;
};

type BaseMetrics = AnalyzedEntityMetrics & {
  fileLinesOfCode: number;
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
  file: BaseAnalyzeInfo;
}

export interface AnalyzeResultPlugin {
  name: string;
  plugin: BasePlugin;
  pluginData: AnalyzedEntity[];
  allPluginsData?: any[];
}

type FilePath = string;

export type BaseFileInfoMap = Record<FilePath, BaseAnalyzeInfo>;

export type AnalyzeResults = {
  plugins: AnalyzeResultPlugin[];
};
