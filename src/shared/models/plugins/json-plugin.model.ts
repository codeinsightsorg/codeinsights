import { BaseAnalyzerPluginModel } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import TreeSitter from "tree-sitter";

export interface JSONPluginModel
  extends BaseAnalyzerPluginModel<JSONAnalyzeInfo> {}

export interface JSONAnalyzeInfo extends BaseAnalyzeInfo {
  ast: TreeSitter.Tree;
  object: Record<string, any>;
}
