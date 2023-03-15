import * as recast from "recast";
import * as tsParser from "recast/parsers/typescript";

export const getAST = (source: string) => {
  return recast.parse(source, {
    parser: tsParser,
  });
};
