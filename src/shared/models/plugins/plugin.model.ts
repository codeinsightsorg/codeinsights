import {
  AnalyzeResults,
  BaseAnalyzeInfo,
  PluginAnalyzedEntity,
} from "../analyze.model";
import { BasePlugin } from "../../../plugins/analyze-plugin";
import { HTMLPlugin } from "./html-plugin.model";
import { TypeScriptPlugin } from "./typescript-plugin.model";
import { JSONPlugin } from "./json-plugin.model";

type Parser = "TypeScript" | "HTML" | "JSON";

export interface BaseAnalyzerPlugin<T extends BaseAnalyzeInfo = any> {
  onFinishProcessing?: () => PluginAnalyzedEntity[];
  onAllFinishProcessing?: (items: AnalyzeResults, plugin: BasePlugin) => any;
  fileExtensions?: RegExp[];
  analyzeFile?: (analyzeInfo: T, pluginOptions: PluginOptions) => any;
  parser?: Parser;
  name?: string;
}

export type AnalyzerPlugin =
  | BaseAnalyzerPlugin
  | TypeScriptPlugin
  | HTMLPlugin
  | JSONPlugin;

export type BeforeHookKeys = "onAllFinishProcessing";

export interface PluginOptions<T = any> {
  disabled?: boolean;
  params?: T;
  path: string;
  beforeHooks: Record<BeforeHookKeys, string>;
}
