import { Visitor } from "ast-types/gen/visitor";
import { AnalyzedEntity, AnalyzeResults } from "./analyze.model";
import { BasePlugin } from "../../plugins/analyze-plugin";

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

export interface AnalyzerPlugin {
  fileExtensions?: string[];
  analyzeFile?: (analyzeInfo: AnalyzeInfo) => any;
  parser?: any;
  onFinishProcessing?: () => AnalyzedEntity[];
  onAllFinishProcessing?: (items: AnalyzeResults, plugin: BasePlugin) => any;
}

export type BeforeHookKeys = "onAllFinishProcessing";

export interface PluginOptions<T = any> {
  disabled?: boolean;
  params?: T;
  path: string;
  beforeHooks: Record<BeforeHookKeys, string>;
}
