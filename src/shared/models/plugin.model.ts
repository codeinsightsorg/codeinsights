import { Visitor } from "ast-types/gen/visitor";
import { AnalyzedEntity } from "./analyze.model";

export interface AnalyzeInfo {
  file: {
    path: string;
    name: string;
    contents: string;
  };
  ast: any;
  helpers: {
    visit: (visitor: Visitor) => any;
  };
}

export interface PluginContext {
  analyzeFile: (analyzeInfo: AnalyzeInfo) => any;
  done: () => AnalyzedEntity[];
}

export interface Plugin {
  id: string;
  fileExtensions?: string[];
  parser?: any;
  analyze: (params?: any) => PluginContext;
  options?: PluginOptions;
}

export interface PluginOptions {
  disabled?: boolean;
  params?: any;
}

export type PluginsContextMap = Record<string, PluginContext>;
