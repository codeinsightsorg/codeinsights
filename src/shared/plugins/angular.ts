import { first } from "lodash";
import { Plugin } from "../models/plugin.model";
import { AnalyzedEntityMetrics } from "../models/analyze.model";

interface Component {
  metrics: AnalyzedEntityMetrics;
  labels: {
    type: "component";
    selector: string;
    name: string;
    path: string;
  };
}

const plugin: Plugin = {
  id: "AngularPlugin",
  analyze() {
    const items: Component[] = [];
    return {
      analyzeFile({ helpers, file }) {
        helpers.visit({
          visitClassDeclaration(path) {
            const decorators = path.value.decorators ?? [];
            for (const decorator of decorators) {
              if (decorator.expression.type === "CallExpression") {
                const name = decorator.expression.callee.name;
                const isComponent = name === "Component";
                if (isComponent) {
                  const componentDef = first<any>(
                    decorator.expression.arguments
                  );
                  const selectorNode = componentDef.properties.find(
                    (property: any) => property.key.name === "selector"
                  );
                  if (selectorNode) {
                    if (selectorNode.value.type === "StringLiteral") {
                      const selectorKey = selectorNode.value.value;
                      const component: Component = {
                        metrics: {},
                        labels: {
                          type: "component",
                          selector: selectorKey,
                          name: path.value.id.name,
                          path: file.path,
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
      },
      done() {
        return items;
      },
    };
  },
};

export default plugin;
