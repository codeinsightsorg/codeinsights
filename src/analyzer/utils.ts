import * as recast from "recast";
import * as tsParser from "recast/parsers/typescript";

export const getAST = (source: string, fileName: string) => {
  if (fileName.endsWith(".ts")) {
    return recast.parse(source, {
      parser: tsParser,
    });
  } else if (fileName.endsWith(".js")) {
    return recast.parse(source);
  }
};
