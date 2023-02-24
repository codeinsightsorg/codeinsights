import {Visitor} from "ast-types/gen/visitor";

export interface IMetadata {
    file: {
        path: string;
        name: string;
        contents: string;
    }
    ast: any;
    helpers: {
        visit: (visitor: Visitor) => any;
    }
}

export interface IPlugin {
    id: string;
    fileExtensions?: string[];
    initialAccumulator?: any;
    analyze: (accumulator: any, metadata: IMetadata) => any;
    parser?: any;
    done?: (items: any) => any;
}

