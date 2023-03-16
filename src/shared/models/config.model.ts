import { PluginOptions } from "./plugin.model";

export interface ConfigModel {
  repoPath?: string;
  ignoreFolders?: string[];
  plugins?: Record<string, PluginOptions | string>;
}
