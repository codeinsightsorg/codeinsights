type FunctionType = 'ObjectMethod' | 'FunctionDeclaration' | 'ClassMethod';

export interface IFile {
    scope: 'file'
    path: string;
    name: string;
    module: string;
    hasStrictEnabled: boolean;
    isTestFile: boolean;
    loc: number;
}

export interface IFunction {
    scope: 'function',
    type: FunctionType;
    name: string;
    file: string;
    loc: number;
}

export type AnalyzedItem = IFile | IFunction;

export interface IComponent {
    scope: 'component',
    selector: string;
    name: string;
    path: string;
}
