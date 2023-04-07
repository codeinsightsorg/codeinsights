import { PluginOptions } from "./plugin.model";

export interface ConfigModel {
  repoPath?: string;
  useCachedRepo?: boolean;
  ignoreFolders?: string[];
  plugins?: (string | PluginOptions)[];
}
