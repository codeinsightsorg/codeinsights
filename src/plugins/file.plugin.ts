import * as tsParser from "recast/parsers/typescript";
import {IPlugin} from "../shared/models/plugins.model";
import {IFile} from "../modules/static-analyzer/types";

export const typescriptFilePlugin: IPlugin = {
    fileExtensions: ['.ts'],
    parser: tsParser,
    analyze(metadata) {
        return [{
            any: 'here'
        }]
    },
    done: (files: IFile[]) => {
        console.log('received files')
        console.log(files);
    }
}
