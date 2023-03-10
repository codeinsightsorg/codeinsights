import { ConfigModel } from "../shared/models/config.model";
import { Plugin } from "../shared/models/plugin.model";
import { merge } from "lodash";
import { DEFAULT_FINALIZERS, DEFAULT_PLUGINS } from "./constants";
import { Finalizer } from "../shared/models/finalizer.model";
import { argv } from "../env";

export class Config {
  data: ConfigModel;
  plugins!: Plugin[];
  finalizers!: Finalizer[];

  constructor(config: ConfigModel) {
    const defaultConfig: ConfigModel = {
      repoPath: argv.repoPath ?? "./",
      flattenOutput: true,
    };
    this.data = merge(defaultConfig, config);
  }

  async init() {
    this.plugins = await this.getAllPlugins();
    this.finalizers = await this.getAllFinalizers();
  }

  private async getAllFinalizers(): Promise<Finalizer[]> {
    const finalizers = this.data.finalizers ?? [];

    const filteredFinalizers = [...DEFAULT_FINALIZERS, ...finalizers].filter(
      (finalizer) => {
        if (Array.isArray(finalizer)) {
          const [fn, options] = finalizer;
          if (options.disabled) {
            return false;
          }
        }
        return true;
      }
    );
    const allFinalizers = await Promise.all(
      filteredFinalizers.map(async (finalizer) => {
        if (typeof finalizer === "string") {
          return (await import(finalizer)).default;
        }
        return finalizer;
      })
    );
    return allFinalizers;
  }

  private async getAllPlugins(): Promise<Plugin[]> {
    const plugins = this.data.plugins ?? [];

    const filteredPlugins = [...DEFAULT_PLUGINS, ...plugins].filter(
      (finalizer) => {
        if (Array.isArray(finalizer)) {
          const [fn, options] = finalizer;
          if (options.disabled) {
            return false;
          }
        }
        return true;
      }
    );

    const allPlugins = await Promise.all(
      filteredPlugins.map(async (plugin) => {
        const defaultPluginOptions: Partial<Plugin> = {
          fileExtensions: [".ts"],
        };
        const mergePluginWithDefaultOptions = (pluginDefinition: Plugin) => {
          return merge(defaultPluginOptions, pluginDefinition);
        };

        if (typeof plugin === "string") {
          const pluginDefinition = (await import(plugin)).default;
          return mergePluginWithDefaultOptions(pluginDefinition);
        } else if (Array.isArray(plugin)) {
          const [path, options] = plugin;
          const pluginDefinition = (await import(path)).default;
          return mergePluginWithDefaultOptions(pluginDefinition);
        }
        return mergePluginWithDefaultOptions(plugin);
      })
    );
    return allPlugins;
  }
}
