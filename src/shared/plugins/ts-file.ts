import { TypeScriptAnalyzeInfo } from "../models/plugins/typescript-plugin.model";
import { TypeScriptPlugin } from "../../modules/plugins/typescript-plugin";

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
  labels: {
    isTestFile: boolean;
  };
  metrics: {
    loc: number;
  };
}

export class TSFilePlugin extends TypeScriptPlugin {
  analyzedItems: (File | FunctionModel)[] = [];

  analyzeFile({ labels, visit, ast }: TypeScriptAnalyzeInfo) {
    const { fileName, filePath } = labels;
    const self = this;
    const isTestFile =
      fileName.endsWith(".spec.js") ||
      fileName.endsWith(".spec.ts") ||
      fileName.endsWith(".test.js") ||
      fileName.endsWith(".test.ts");
    const fileDefinition: File = {
      type: "file",
      path: filePath,
      labels: {
        isTestFile,
      },
      metrics: {
        loc: ast.loc.end.line,
      },
    };

    visit({
      visitFunction(path) {
        const functionEntity: FunctionModel = {
          type: "function",
          path: filePath,
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
