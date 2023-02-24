import {first} from "lodash";
import {IPlugin} from "../shared/models/plugins.model";

interface IComponent {
    scope: 'component',
    selector: string;
    name: string;
    path: string;
}


export function angularPlugin() {
    const plugin: IPlugin = {
        id: 'AngularPlugin',
        initialAccumulator: [],
        analyze(acc, metadata) {
            const items: any[] = [];

            metadata.helpers.visit({
                visitClassDeclaration(path) {
                    const decorators = path.value.decorators ?? [];
                    for (const decorator of decorators) {
                        if (decorator.expression.type === 'CallExpression') {
                            const name = decorator.expression.callee.name;
                            const isComponent = name === 'Component';
                            if (isComponent) {
                                const componentDef = first<any>(decorator.expression.arguments);
                                const selectorNode = componentDef.properties.find((property: any) => property.key.name === 'selector');
                                if (selectorNode) {
                                    if (selectorNode.value.type === 'StringLiteral') {
                                        const selectorKey = selectorNode.value.value;
                                        const component: IComponent = {
                                            scope: 'component',
                                            selector: selectorKey,
                                            name: path.value.id.name,
                                            path: metadata.file.path
                                        }
                                        items.push(component);
                                    }
                                }
                            }
                        }
                    }
                    this.traverse(path);
                },
            });

            return [...acc, ...items];
        }
    }
    return plugin;
}

