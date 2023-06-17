import { BaseAnalyzerPluginModel } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import { Visitor } from "ast-types/gen/visitor";
import { Options, types } from "recast";
import { PrintResultType } from "recast/lib/printer";

export interface TypeScriptPluginModel
  extends BaseAnalyzerPluginModel<TypeScriptAnalyzeInfo> {}

export interface TypeScriptAnalyzeInfo extends BaseAnalyzeInfo {
  fileExtension: ".ts";
  visit: (visitor: Visitor) => any;
  print: (node: types.ASTNode, options?: Options) => PrintResultType;
  prettyPrint: (node: types.ASTNode, options?: Options) => PrintResultType;
  ast: any;
}
