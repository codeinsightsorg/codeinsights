import {AnalyzedItem, IComponent, IFile} from "../modules/static-analyzer/types";
import {Visitor} from "ast-types/gen/visitor";
import {first} from "lodash";

export function analyzeAngularComponent(items: AnalyzedItem[], filePath: string, file: IFile): Visitor {
    return {
        visitComment: function (path) {
            const commentValue: string = path.value.value;
            const containsTsIgnore = commentValue.includes('@ts-strict-ignore')
            file.hasStrictEnabled = !containsTsIgnore;
            if (containsTsIgnore) {
                return false;
            } else {
                this.traverse(path);
            }
        },
        visitClassDeclaration(path){
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
                                    path: filePath
                                }
                                items.push(component as unknown as AnalyzedItem);
                            }
                        }
                    }
                }
            }
            this.traverse(path);
        },
    }
}
