import { PluginOptions } from "./plugins/plugin.model";

export interface ConfigModel {
  repoPath?: string;
  ignoreFolders?: string[];
  plugins?: (string | PluginOptions)[];
  useDefaultPlugins?: boolean;
}
