import {
  AnalyzeResults,
  BaseAnalyzeInfo,
  PluginAnalyzedEntity,
} from "../analyze.model";
import { BasePlugin } from "../../../modules/parser/plugin-parsers/analyze-plugin";
import { HTMLPluginModel } from "./html-plugin.model";
import { TypeScriptPluginModel } from "./typescript-plugin.model";
import { JSONPluginModel } from "./json-plugin.model";

export interface BaseAnalyzerPluginModel<T extends BaseAnalyzeInfo = any> {
  onFinishProcessing?: () => PluginAnalyzedEntity[];
  onAllFinishProcessing?: (items: AnalyzeResults, plugin: BasePlugin) => any;
  fileExtensions?: string[];
  analyzeFile?: (analyzeInfo: T, pluginOptions: PluginOptions) => any;
  name?: string;
}

export type AnalyzerPlugin =
  | BaseAnalyzerPluginModel
  | TypeScriptPluginModel
  | HTMLPluginModel
  | JSONPluginModel;

export type BeforeHookKeys = "onAllFinishProcessing";

export interface PluginOptions<T = any> {
  disabled?: boolean;
  params?: T;
  path: string;
  beforeHooks?: Record<BeforeHookKeys, string>;
}
