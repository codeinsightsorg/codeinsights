import { TypeScriptAnalyzeInfo } from "../models/plugins/typescript-plugin.model";
import { TypeScriptPlugin } from "../../modules/plugins/typescript-plugin";
import { getFunctionDetailsFromNode } from "./shared/function.utils";

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
        const functionDetails = getFunctionDetailsFromNode(path);
        if (functionDetails) {
          functionEntity.labels = {
            ...functionEntity.labels,
            ...functionDetails.labels,
          };
          functionEntity.metrics = {
            ...functionEntity.metrics,
            ...functionDetails.metrics,
          };
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
