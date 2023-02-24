import * as tsParser from "recast/parsers/typescript";
import { Plugin } from "../shared/models/plugin.model";

type FunctionType = "ObjectMethod" | "FunctionDeclaration" | "ClassMethod";

interface IFile {
  type: "file";
  path: string;
  name: string;
  module: string;
  hasStrictEnabled: boolean;
  isTestFile: boolean;
  loc: number;
}

interface IFunction {
  type: "function";
  functionType: FunctionType;
  name: string;
  file: string;
  loc: number;
}

type AnalyzedItem = IFile | IFunction;

export const typescriptFilePlugin: Plugin = {
  id: "TypeScriptFile",
  fileExtensions: [".ts"],
  parser: tsParser,
  initialAccumulator: [],
  analyze(acc, metadata) {
    const analyzedItems: AnalyzedItem[] = [];
    const isTestFile = metadata.file.name.endsWith(".spec.ts");
    const file = {
      type: "file",
      path: metadata.file.path,
      name: metadata.file.name,
      loc: metadata.ast.loc.end.line,
      isTestFile,
    } as IFile;

    metadata.helpers.visit({
      visitFunction(path) {
        const baseFunctionObj = {
          type: "function",
          file: metadata.file.path,
          functionType: path.value.type,
        } as IFunction;

        if (
          path.value.type === "ClassMethod" ||
          path.value.type === "ObjectMethod"
        ) {
          const loc = path.value.loc.end.line - path.value.loc.start.line;
          const fn: IFunction = {
            ...baseFunctionObj,
            name: path.value.key.name,
            loc,
          };
          analyzedItems.push(fn);
        }
        if (path.value.type === "FunctionDeclaration") {
          const fn: IFunction = {
            ...baseFunctionObj,
            name: path.value.id.name,
            loc: path.value.body.loc.end.line - path.value.body.loc.start.line,
          };
          analyzedItems.push(fn);
        }
        this.traverse(path);
      },
    });
    analyzedItems.push(file);
    return [...acc, ...analyzedItems];
  },
};
