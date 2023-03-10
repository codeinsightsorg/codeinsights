import { PluginOptions } from "./plugin.model";
import { FinalizerOptions } from "./finalizer.model";

export interface ConfigModel {
  repoPath?: string;
  ignoreFolders?: string[];
  flattenOutput?: boolean;
  plugins?: Array<string | [string, PluginOptions]>;
  finalizers?: Array<string | [string, FinalizerOptions]>;
}

const config: ConfigModel = {
  ignoreFolders: ["protos", "rules-standalone", "scripts", "app/new-protos"],
  repoPath: "/Users/yaircohen/Desktop/Code/Coralogix/front-end/web-app/src",
  plugins: [
    ["/Users/yaircohen/Desktop/code-analyzer/src/plugins/angular.ts", {}],
    "/Users/yaircohen/Desktop/code-analyzer/src/plugins/strict-ignore-comment.ts",
  ],
  finalizers: [
    [
      "/Users/yaircohen/Desktop/code-analyzer/src/finalizers/coralogix-finalizer.ts",
      { disabled: true },
    ],
    "/Users/yaircohen/Desktop/code-analyzer/src/finalizers/console-log-finalizer.ts",
  ],
};
