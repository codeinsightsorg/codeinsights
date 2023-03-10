import * as tsParser from "recast/parsers/typescript";
import { Plugin } from "../models/plugin.model";

type FunctionType = "ObjectMethod" | "FunctionDeclaration" | "ClassMethod";

interface FunctionModel {
  metrics: {
    loc?: number;
  };
  labels: {
    type?: "function";
    functionType?: FunctionType;
    name?: string;
    file?: string;
  };
}

interface File {
  metrics: {
    loc: number;
  };
  labels: {
    type: "file";
    path: string;
    name: string;
    isTestFile: boolean;
  };
}

export const typescriptFilePlugin: Plugin = {
  id: "TypeScriptFile",
  fileExtensions: [".ts"],
  parser: tsParser,
  analyze() {
    const analyzedItems: (File | FunctionModel)[] = [];
    return {
      analyzeFile({ file, helpers, ast }) {
        const isTestFile = file.name.endsWith(".spec.ts");
        const fileDefinition: File = {
          metrics: {
            loc: ast.loc.end.line,
          },
          labels: {
            type: "file",
            path: file.path,
            name: file.name,
            isTestFile,
          },
        };

        helpers.visit({
          visitFunction(path) {
            const functionEntity: FunctionModel = {
              metrics: {},
              labels: {
                type: "function",
                file: file.path,
                functionType: path.value.type,
              },
            };
            if (
              path.value.type === "ClassMethod" ||
              path.value.type === "ObjectMethod"
            ) {
              functionEntity.metrics.loc =
                path.value.loc.end.line - path.value.loc.start.line;
              functionEntity.labels.name = path.value.key.name;
            }
            if (path.value.type === "FunctionDeclaration") {
              functionEntity.labels.name = path.value.id.name;
              functionEntity.metrics.loc =
                path.value.body.loc.end.line - path.value.body.loc.start.line;
            }
            analyzedItems.push(functionEntity);
            this.traverse(path);
          },
        });
        analyzedItems.push(fileDefinition);
      },
      done() {
        return analyzedItems;
      },
    };
  },
};
