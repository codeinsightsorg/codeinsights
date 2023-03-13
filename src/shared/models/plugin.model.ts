import { Visitor } from "ast-types/gen/visitor";
import { AnalyzedEntity, AnalyzeResults } from "./analyze.model";

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

export interface AnalyzerPlugin<T = null> {
  fileExtensions?: string[];
  analyzeFile?: (analyzeInfo: AnalyzeInfo) => any;
  parser?: any;
  options?: PluginOptions<T>;
  onFinishProcessing?: () => AnalyzedEntity[];
  onAllFinishProcessing?: (
    items: AnalyzeResults,
    config?: T
  ) => any | Promise<any>;
}

export interface PluginOptions<T = any> {
  disabled?: boolean;
  params?: T;
  path: string;
}
