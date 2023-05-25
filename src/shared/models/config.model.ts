import { PluginOptions } from "./plugins/plugin.model";

export type ConfigPluginModel = string | PluginOptions;
export interface ConfigModel {
  repoPath?: string;
  ignoreFolders?: string[];
  plugins?: ConfigPluginModel[];
  useDefaultPlugins?: boolean;
}
