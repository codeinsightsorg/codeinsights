export interface IMetadata {
    fileString: string;
    ast: any;
}

export interface IPlugin {
    fileExtensions: string[];
    parser: any;
    analyze: (metadata: IMetadata) => any[];
    done: (items: any[]) => void;
}

