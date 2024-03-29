import { first } from "lodash";
import { AnalyzedEntityMetrics } from "../models/analyze.model";
import { TypeScriptAnalyzeInfo } from "../models/plugins/typescript-plugin.model";
import { TypeScriptPlugin } from "../../modules/plugins";

interface Component {
  type: "component";
  path: string;
  metrics: AnalyzedEntityMetrics;
  labels: {
    selector: string;
    name: string;
  };
}

export class AngularPlugin extends TypeScriptPlugin {
  items: Component[] = [];

  analyzeFile({ visit, labels }: TypeScriptAnalyzeInfo) {
    const items: Component[] = [];
    visit({
      visitClassDeclaration(path) {
        const decorators = path.value.decorators ?? [];
        for (const decorator of decorators) {
          if (decorator.expression.type === "CallExpression") {
            const name = decorator.expression.callee.name;
            const isComponent = name === "Component";
            if (isComponent) {
              const componentDef = first<any>(decorator.expression.arguments);
              const selectorNode = componentDef.properties.find(
                (property: any) => property.key.name === "selector"
              );
              if (selectorNode) {
                if (selectorNode.value.type === "StringLiteral") {
                  const selectorKey = selectorNode.value.value;
                  const component: Component = {
                    metrics: {},
                    path: labels.filePath,
                    type: "component",
                    labels: {
                      selector: selectorKey,
                      name: path.value.id.name,
                    },
                  };
                  items.push(component);
                }
              }
            }
          }
        }
        this.traverse(path);
      },
    });
    this.items.push(...items);
  }

  onFinishProcessing() {
    return this.items;
  }
}

export default AngularPlugin;
