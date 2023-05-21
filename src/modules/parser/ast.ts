import * as recast from "recast";
import * as tsParser from "recast/parsers/typescript";

const babelParser = require("@babel/parser");

export const getAST = (source: string, fileName: string) => {
  if (fileName.endsWith(".ts")) {
    return recast.parse(source, {
      parser: tsParser,
    });
  } else if (fileName.endsWith(".js")) {
    return recast.parse(source, {
      parser: {
        parse(source: string) {
          return babelParser.parse(source, {
            sourceType: "unambiguous",
            allowAwaitOutsideFunction: true,
            allowImportExportEverywhere: true,
            allowUndeclaredExports: true,
            allowNewTargetOutsideFunction: true,
            allowReturnOutsideFunction: true,
            allowSuperOutsideMethod: true,
            errorRecovery: true,
            strictMode: false,
            plugins: [
              "jsx",
              "typescript",
              "classProperties",
              "objectRestSpread",
              "decorators-legacy",
            ],
          });
        },
      },
    });
  }
};
