import { PluginOptions } from "./plugin.model";
import { FinalizerOptions } from "./finalizer.model";

export type FinalizerConfig = string | [string, FinalizerOptions];

export interface ConfigModel {
  repoPath?: string;
  ignoreFolders?: string[];
  plugins?: Array<string | [string, PluginOptions]>;
  finalizers?: Array<FinalizerConfig>;
}
