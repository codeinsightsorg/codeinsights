import {Config, ConfigSchema} from "./config.model";

export function readConfig() {
    const mockConfig: Config = {
        ignoreFolders: ['protos', 'rules-standalone', 'scripts', 'app/new-protos'],
        repoPath: '/Users/yaircohen/Desktop/Code/Coralogix/front-end/web-app/src'
    }
    return ConfigSchema.parse(mockConfig);
}

export const config = readConfig();
