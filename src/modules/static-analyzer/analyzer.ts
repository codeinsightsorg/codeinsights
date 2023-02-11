import * as recast from 'recast';
import {AnalyzedItem, IFile, IFunction} from "./types";
import {isTSFile} from "../../shared/utils";
import {last} from "lodash";
import {getAST} from "./utils";


export async function analyzeFile(tsStr: string, filePath: string): Promise<AnalyzedItem[]> {
    const analyzedItems: AnalyzedItem[] = [];


    const fileName = last(filePath.split('/')) as string;

    if (isTSFile(fileName)) {
        const ast = getAST(tsStr);

        const isTestFile = fileName.endsWith('.spec.ts');

        const file = {
            scope: 'file',
            path: filePath,
            name: fileName,
            loc: ast.loc.end.line,
            isTestFile
        } as IFile;

        recast.visit(ast, {
            visitFunction(path) {
                const baseFunctionObj = {
                    scope: 'function',
                    file: filePath,
                    type: path.value.type,
                } as IFunction;

                if (path.value.type === 'ClassMethod' || path.value.type === 'ObjectMethod') {
                    const loc = path.value.loc.end.line - path.value.loc.start.line;
                    const fn: IFunction = {
                        ...baseFunctionObj,
                        name: path.value.key.name,
                        loc,
                    }
                    analyzedItems.push(fn);
                }
                if (path.value.type === 'FunctionDeclaration') {
                    const fn: IFunction = {
                        ...baseFunctionObj,
                        name: path.value.id.name,
                        loc: path.value.body.loc.end.line - path.value.body.loc.start.line
                    }
                    analyzedItems.push(fn);
                }
                this.traverse(path);
            }
        });

        analyzedItems.push(file);
    }

    return analyzedItems;
}
