import {IPlugin} from "./plugins.model";
import {PostProcessor} from "./post-processor.model";

export interface IConfig {
    repoPath?: string;
    ignoreFolders?: string[];
    plugins?: IPlugin[];
    flattenOutput?: boolean;
    postProcessors?: PostProcessor[];
}


