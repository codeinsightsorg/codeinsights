import { Visitor } from "ast-types/gen/visitor";
import { AnalyzedEntity, AnalyzeResults } from "./analyze.model";
import { BasePlugin } from "../../plugins/analyze-plugin";
import { DOMWindow } from "jsdom";
import recast, { Options, types } from "recast";
import { PrintResultType } from "recast/lib/printer";
import { ParseError } from "@babel/parser";

export interface BaseAnalyzeInfo {
  file: {
    path: string;
    name: string;
    contents: string;
  };
}

export interface TypeScriptAnalyzeInfo extends BaseAnalyzeInfo {
  visit: (visitor: Visitor) => any;
  print: (node: types.ASTNode, options?: Options) => PrintResultType;
  prettyPrint: (node: types.ASTNode, options?: Options) => PrintResultType;
  ast: any;
}

export interface HTMLAnalyzeInfo extends BaseAnalyzeInfo {
  window: DOMWindow;
  document: Document;
}

type Parser = "TypeScript" | "HTML";

export interface BaseAnalyzerPlugin<T extends BaseAnalyzeInfo = any> {
  onFinishProcessing?: () => AnalyzedEntity[];
  onAllFinishProcessing?: (items: AnalyzeResults, plugin: BasePlugin) => any;
  fileExtensions?: string[];
  analyzeFile?: (analyzeInfo: T, pluginOptions: PluginOptions) => any;
  parser?: Parser;
}

export interface TypeScriptPlugin
  extends BaseAnalyzerPlugin<TypeScriptAnalyzeInfo> {
  parser: "TypeScript";
}

export interface HTMLPlugin extends BaseAnalyzerPlugin<HTMLAnalyzeInfo> {
  parser: "HTML";
}

export type AnalyzerPlugin = BaseAnalyzerPlugin | TypeScriptPlugin | HTMLPlugin;

export type BeforeHookKeys = "onAllFinishProcessing";

export interface PluginOptions<T = any> {
  disabled?: boolean;
  params?: T;
  path: string;
  beforeHooks: Record<BeforeHookKeys, string>;
}
