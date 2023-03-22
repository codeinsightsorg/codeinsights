import {
  AnalyzerPlugin,
  TypeScriptAnalyzeInfo,
  TypeScriptPlugin,
} from "../src/shared/models/plugin.model";

type FunctionType = "ObjectMethod" | "FunctionDeclaration" | "ClassMethod";

interface FunctionModel {
  type: "function";
  metrics: {
    loc?: number;
  };
  labels: {
    functionType?: FunctionType;
    name?: string;
    file?: string;
  };
}

interface File {
  type: "file";
  metrics: {
    loc: number;
  };
  labels: {
    path: string;
    name: string;
    isTestFile: boolean;
  };
}

export class TSFilePlugin implements TypeScriptPlugin {
  analyzedItems: (File | FunctionModel)[] = [];
  parser = "TypeScript" as const;

  analyzeFile({ file, visit, ast, prettyPrint }: TypeScriptAnalyzeInfo) {
    const self = this;
    const isTestFile = file.name.endsWith(".spec.ts");
    const fileDefinition: File = {
      type: "file",
      metrics: {
        loc: ast.loc.end.line,
      },
      labels: {
        path: file.path,
        name: file.name,
        isTestFile,
      },
    };

    visit({
      visitFunction(path) {
        const functionEntity: FunctionModel = {
          type: "function",
          metrics: {},
          labels: {
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
          functionEntity.labels.name = path?.value?.id?.name ?? "";
          functionEntity.metrics.loc =
            path.value.body.loc.end.line - path.value.body.loc.start.line;
        }
        if (path.value.type === "ArrowFunctionExpression") {
          functionEntity.labels.name = path?.value?.id?.name ?? "";
          functionEntity.metrics.loc =
            path.value.body.loc.end.line - path.value.body.loc.start.line;
        }
        self.analyzedItems.push(functionEntity);
        this.traverse(path);
      },
    });
    this.analyzedItems.push(fileDefinition);
  }

  onFinishProcessing() {
    return this.analyzedItems;
  }
}

export default TSFilePlugin;
