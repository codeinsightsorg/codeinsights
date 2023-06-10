import { getAST } from "../ast";
import * as recast from "recast";
import { IPluginAnalyzeInfo } from "../../plugins/models/plugin-analyze";
import { Visitor } from "ast-types/gen/visitor";

export function typescriptPlugin(info: IPluginAnalyzeInfo) {
  const ast: any = getAST(info.fileContents, info.fileName);
  return {
    ast,
    visit: (visitor: Visitor) => recast.visit(ast, visitor),
    print: recast.print,
    prettyPrint: recast.prettyPrint,
  };
}
