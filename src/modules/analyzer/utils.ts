import * as recast from "recast";
import * as tsParser from "recast/parsers/typescript";

export const getAST = (source: string, parser: any) => {
    return recast.parse(source, {
        parser: parser ?? tsParser
    });
}
