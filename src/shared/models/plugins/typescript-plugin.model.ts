import { BaseAnalyzerPlugin } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import { Visitor } from "ast-types/gen/visitor";
import { Options, types } from "recast";
import { PrintResultType } from "recast/lib/printer";

export interface TypeScriptPlugin
  extends BaseAnalyzerPlugin<TypeScriptAnalyzeInfo> {
  parser: "TypeScript";
}

export interface TypeScriptAnalyzeInfo extends BaseAnalyzeInfo {
  visit: (visitor: Visitor) => any;
  print: (node: types.ASTNode, options?: Options) => PrintResultType;
  prettyPrint: (node: types.ASTNode, options?: Options) => PrintResultType;
  ast: any;
}
