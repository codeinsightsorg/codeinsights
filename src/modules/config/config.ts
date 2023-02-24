import {IConfig} from "../../shared/models/config.model";
import {IPlugin} from "../../shared/models/plugins.model";
import {angularPlugin} from "../../plugins/angular";
import {merge} from 'lodash';
import {consoleLogProcessor} from "../../post-processors/console-log-processor";
import {DEFAULT_PLUGINS, DEFAULT_POST_PROCESSORS} from "./constants";
import {PostProcessor} from "../../shared/models/post-processor.model";
import {coralogixProcessor} from "../../post-processors/coralogix-processor";
import {strictIgnoreCommentPlugin} from "../../plugins/strict-ignore-comment";

export class Config {
    data: IConfig;

    constructor(config: IConfig) {
        const defaultConfig: IConfig = {
            repoPath: './',
            flattenOutput: true,
        }
        this.data = merge(defaultConfig, config);
    }

    getAllPostProcessors(): PostProcessor[] {
        const postProcessors = config.data.postProcessors ?? [];
        return [...DEFAULT_POST_PROCESSORS, ...postProcessors].filter(processor => {
            if (Array.isArray(processor)) {
                const [fn, options] = processor;
                if (options.disabled) {
                    return false
                }
            }
            return true;
        })
    }

    getAllPlugins(): IPlugin[] {
        const plugins = config.data.plugins ?? [];
        return [...DEFAULT_PLUGINS, ...plugins].map(plugin => {
            const defaultPluginOptions: Partial<IPlugin> = {
                fileExtensions: ['.ts']
            };
            return merge(defaultPluginOptions, plugin);
        });
    }
}

const mockConfig: IConfig = {
    ignoreFolders: ['protos', 'rules-standalone', 'scripts', 'app/new-protos'],
    repoPath: '/Users/yaircohen/Desktop/Code/Coralogix/front-end/web-app/src',
    plugins: [
        angularPlugin(),
        strictIgnoreCommentPlugin()
    ],
    postProcessors: [
        [consoleLogProcessor(), {disabled: true}],
        [
            coralogixProcessor({privateKey: process.env.CGX_PRIVATE_KEY! }),
            {
                disabled: true,
                beforeProcess: (items: any[]) => {
                    return items.map(data => {
                        return {
                            timestamp: Date.now(),
                            severity: 1,
                            text: data
                        }
                    })
                }
            }
        ],
    ]
}

export const config = new Config(mockConfig);
