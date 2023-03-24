import {
  TypeScriptAnalyzeInfo,
  TypeScriptPlugin,
} from "../src/shared/models/plugin.model";

type FunctionType = "ObjectMethod" | "FunctionDeclaration" | "ClassMethod";

interface FunctionModel {
  type: "function";
  path: string;
  metrics: {
    loc?: number;
  };
  labels: {
    functionType?: FunctionType;
    name?: string;
  };
}

interface File {
  type: "file";
  path: string;
  metrics: {
    loc: number;
  };
  labels: {
    isTestFile: boolean;
  };
}

export class TSFilePlugin implements TypeScriptPlugin {
  analyzedItems: (File | FunctionModel)[] = [];
  parser = "TypeScript" as const;

  analyzeFile({ file, visit, ast, prettyPrint }: TypeScriptAnalyzeInfo) {
    const self = this;
    const isTestFile =
      file.name.endsWith(".spec.ts") || file.name.endsWith(".test.ts");
    const fileDefinition: File = {
      type: "file",
      path: file.path,
      metrics: {
        loc: ast.loc.end.line,
      },
      labels: {
        isTestFile,
      },
    };

    visit({
      visitFunction(path) {
        const functionEntity: FunctionModel = {
          type: "function",
          path: file.path,
          metrics: {},
          labels: {
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
