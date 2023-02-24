import { Plugin } from "./plugin.model";
import { Finalizer } from "./finalizer.model";

export interface ConfigModel {
  repoPath?: string;
  ignoreFolders?: string[];
  flattenOutput?: boolean;
  plugins?: Plugin[];
  finalizers?: Finalizer[];
}
