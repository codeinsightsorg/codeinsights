import * as tsParser from "recast/parsers/typescript";
import { Plugin } from "../models/plugin.model";
import { AnalyzedEntityMetrics } from "../models/analyze.model";

interface ImportDefinition {
  metrics: AnalyzedEntityMetrics;
  labels: {
    type: "import";
    filePath: string;
    name: string;
    fileName: string;
    importedFrom: string;
  };
}

export const importPlugin: Plugin = {
  id: "Imports",
  fileExtensions: [".ts"],
  parser: tsParser,
  analyze() {
    const allFilesImports: ImportDefinition[] = [];
    return {
      analyzeFile({ file, helpers }) {
        helpers.visit({
          visitImportDeclaration(path) {
            const importPath = path.node.source.value as string;
            const importItems = path.node.specifiers;
            if (importItems?.length) {
              for (const item of importItems) {
                const getName = () => {
                  if (
                    item.type === "ImportDefaultSpecifier" ||
                    item.type === "ImportNamespaceSpecifier"
                  ) {
                    return item.local?.name;
                  }
                  return item.imported.name;
                };
                const importDefinition: ImportDefinition = {
                  metrics: {},
                  labels: {
                    type: "import",
                    filePath: file.path,
                    fileName: file.name,
                    name: getName() as string,
                    importedFrom: importPath,
                  },
                };
                allFilesImports.push(importDefinition);
              }
            }
            this.traverse(path);
          },
        });
      },
      done() {
        return allFilesImports;
      },
    };
  },
};
