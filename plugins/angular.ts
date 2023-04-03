import { first } from "lodash";
import {
  TypeScriptAnalyzeInfo,
  TypeScriptPlugin,
} from "../src/shared/models/plugin.model";
import { AnalyzedEntityMetrics } from "../src/shared/models/analyze.model";

interface Component {
  type: "component";
  path: string;
  metrics: AnalyzedEntityMetrics;
  labels: {
    selector: string;
    name: string;
  };
}

export class AngularPlugin implements TypeScriptPlugin {
  items: Component[] = [];
  parser = "TypeScript" as const;

  analyzeFile({ visit, labels }: TypeScriptAnalyzeInfo) {
    const file = labels.file;
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
                    path: file.path,
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
