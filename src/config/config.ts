import { ConfigModel } from "../shared/models/config.model";
import { Plugin } from "../shared/models/plugin.model";
import { merge } from "lodash";
import { DEFAULT_PLUGINS, DEFAULT_FINALIZERS } from "./constants";
import { Finalizer } from "../shared/models/finalizer.model";
import { argv } from "../env";

export class Config {
  data: ConfigModel;

  constructor(config: ConfigModel) {
    const defaultConfig: ConfigModel = {
      repoPath: argv.repoPath ?? "./",
      flattenOutput: true,
    };
    this.data = merge(defaultConfig, config);
  }

  getAllFinalizers(): Finalizer[] {
    const finalizers = this.data.finalizers ?? [];
    return [...DEFAULT_FINALIZERS, ...finalizers].filter((finalizer) => {
      if (Array.isArray(finalizer)) {
        const [fn, options] = finalizer;
        if (options.disabled) {
          return false;
        }
      }
      return true;
    });
  }

  getAllPlugins(): Plugin[] {
    const plugins = this.data.plugins ?? [];
    return [...DEFAULT_PLUGINS, ...plugins].map((plugin) => {
      const defaultPluginOptions: Partial<Plugin> = {
        fileExtensions: [".ts"],
      };
      return merge(defaultPluginOptions, plugin);
    });
  }
}
