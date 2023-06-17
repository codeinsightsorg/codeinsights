import { first } from "lodash";
import { TypeScriptAnalyzeInfo } from "../models/plugins";
import { TypeScriptPlugin } from "../../modules/plugins";
import { HTMLAnalyzeInfo } from "../models/plugins";

interface Component {
  type: "component";
  path: string;
  labels: {
    selector: string;
    name: string;
  };
}

interface Prop {
  type: "prop";
  path: string;
  labels: {
    kind: "Input" | "Output";
    name: string;
  };
  metrics: {
    usage: number;
  };
}

export class AngularPlugin extends TypeScriptPlugin {
  components: Component[] = [];
  props: Prop[] = [];
  fileExtensions = [".ts", ".html"];
  htmlFilesInfo: HTMLAnalyzeInfo[] = [];

  analyzeFile(info: TypeScriptAnalyzeInfo | HTMLAnalyzeInfo) {
    const self = this;

    if (info.fileExtension === ".ts") {
      info.visit({
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
                      path: info.labels.filePath,
                      type: "component",
                      labels: {
                        selector: selectorKey,
                        name: path.value.id.name,
                      },
                    };
                    self.components.push(component);
                  }
                }
              }
            }
          }
          this.traverse(path);
        },
        visitClassProperty(path) {
          const decorators = (path.value.decorators as any[]) || [];
          const isInput = decorators.some(
            (decorator) => decorator.expression.callee.name === "Input"
          );
          const isOutput = decorators.some(
            (decorator) => decorator.expression.callee.name === "Output"
          );
          if (isInput || isOutput) {
            const propName = path.value.key.name;
            self.props.push({
              type: "prop",
              path: info.labels.filePath,
              labels: {
                kind: isInput ? "Input" : "Output",
                name: propName,
              },
              metrics: {
                usage: 0,
              },
            });
          }
          this.traverse(path);
        },
      });
    } else {
      this.htmlFilesInfo.push(info);
    }
  }

  onFinishProcessing() {
    const componentsToAttributesMap = this.getComponentsToAttributesMap();
    const enrichedProps = this.props.map((prop) => {
      const componentAttributes = componentsToAttributesMap.get(prop.path);

      for (const usageArr of componentAttributes) {
        const propUsage = usageArr.find(
          (usage: any) =>
            usage.value === prop.labels.name && usage.kind === prop.labels.kind
        );
        if (propUsage) {
          prop.metrics.usage++;
        }
      }

      return prop;
    });
    this.props = enrichedProps;
    console.log(this.props);
    return [...this.components, ...this.props];
  }

  private getComponentsToAttributesMap() {
    const selectorsToAttributesMap = this.getSelectorsToAttributesMap();

    return this.components.reduce((map, component) => {
      const attributesList =
        selectorsToAttributesMap[component.labels.selector];
      if (!attributesList) {
        return map;
      }
      const filteredAttributes = attributesList.map((list) => {
        return list.filter((att) => isSupportedAngularAttribute(att));
      });
      const attrValues = filteredAttributes.map((attributeList) => {
        return attributeList.map((attribute) => {
          return {
            value: getAngularAttributeValue(attribute),
            kind: attribute[0] === "(" ? "Output" : "Input",
          };
        });
      });
      map.set(component.path, attrValues);
      return map;
    }, new Map());
  }

  private getSelectorsToAttributesMap() {
    const componentsSelectors = this.components.map(
      (item) => item.labels.selector
    );
    const selectorToPropsMap: Record<string, Array<string[]>> = {};

    this.htmlFilesInfo.forEach((file) => {
      componentsSelectors.forEach((selector) => {
        const componentElement = file.document.querySelector(selector);
        if (!componentElement) {
          return;
        }
        const attributes = Array.from(componentElement.attributes).map(
          (attribute) => attribute.name
        );
        if (!selectorToPropsMap[selector]) {
          selectorToPropsMap[selector] = [];
        }
        selectorToPropsMap[selector].push(attributes);
      });
    });

    return selectorToPropsMap;
  }
}

const ATTR_RE = /^(\[|\(|\[\()?(\w+)(\)|\]|\]\))?$/;

function isSupportedAngularAttribute(attribute: string) {
  return ATTR_RE.test(attribute);
}

function getAngularAttributeValue(attribute: string) {
  return attribute.replace(ATTR_RE, "$2");
}

export default AngularPlugin;
