import { TypeScriptAnalyzeInfo } from "../models/plugins/typescript-plugin.model";
import { TypeScriptPlugin } from "../../modules/plugins/typescript-plugin";
import * as recast from "recast";
import { getFunctionDetailsFromNode } from "./shared/function.utils";
import { namedTypes as n } from "ast-types";

interface FunctionModel {
  type: "functionCyclomaticComplexity";
  path: string;
  metrics: {
    cyclomaticComplexity?: number;
    line?: number;
  };
  labels: {
    name?: string;
  };
}

export class CyclomaticComplexity extends TypeScriptPlugin {
  analyzedItems: FunctionModel[] = [];

  analyzeFile({ labels, visit }: TypeScriptAnalyzeInfo) {
    const { filePath } = labels;
    const self = this;

    visit({
      visitFunction(path) {
        let complexity = 1; // initialize with 1 as there's always a single exit point

        recast.visit(path.node, {
          visitNode(path) {
            if (
              n.IfStatement.check(path.node) ||
              n.SwitchCase.check(path.node) ||
              n.ForStatement.check(path.node) ||
              n.ForInStatement.check(path.node) ||
              n.ForOfStatement.check(path.node) ||
              n.WhileStatement.check(path.node) ||
              n.DoWhileStatement.check(path.node) ||
              n.CatchClause.check(path.node) ||
              n.ConditionalExpression.check(path.node) ||
              n.TryStatement.check(path.node)
            ) {
              complexity++;
            }
            this.traverse(path);
          },
        });

        if (n.LogicalExpression.check(path.node)) {
          if (path.node.operator === "&&" || path.node.operator === "||") {
            complexity++;
          }
        }

        // check for additional cases like '?.' and '??' operators
        if (
          n.OptionalCallExpression.check(path.node) ||
          n.OptionalMemberExpression.check(path.node)
        ) {
          complexity++;
        }

        const functionDetails = getFunctionDetailsFromNode(path);

        if (functionDetails) {
          self.analyzedItems.push({
            type: "functionCyclomaticComplexity",
            path: filePath,
            metrics: {
              cyclomaticComplexity: complexity,
              ...functionDetails.metrics,
            },
            labels: {
              ...functionDetails.labels,
            },
          });
        }

        this.traverse(path);
      },
    });
  }

  onFinishProcessing() {
    return this.analyzedItems;
  }
}

export default CyclomaticComplexity;
