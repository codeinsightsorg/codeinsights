import { BaseAnalyzerPlugin } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import TreeSitter from "tree-sitter";

export interface JSONPlugin extends BaseAnalyzerPlugin<JSONAnalyzeInfo> {
  parser: "JSON";
}

export interface JSONAnalyzeInfo extends BaseAnalyzeInfo {
  ast: TreeSitter.Tree;
  object: Record<string, any>;
}
