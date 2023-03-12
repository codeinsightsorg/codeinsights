import { ConfigModel, FinalizerConfig } from "../shared/models/config.model";
import { Plugin, PluginOptions } from "../shared/models/plugin.model";
import { merge } from "lodash";
import { DEFAULT_FINALIZERS, DEFAULT_PLUGINS } from "./constants";
import {
  Finalizer,
  FinalizerOptions,
  FinalizerProcessFn,
} from "../shared/models/finalizer.model";
import { argv } from "../env";

export class Config {
  data: ConfigModel;
  plugins!: Plugin[];
  finalizers!: Finalizer[];

  constructor(config: ConfigModel) {
    const defaultConfig: ConfigModel = {
      repoPath: argv.repoPath ?? "./",
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
          if (options?.disabled) {
            return false;
          }
        }
        return true;
      }
    );

    const getProcessorFn = async (
      finalizer: FinalizerConfig | Finalizer
    ): Promise<{
      processFn: FinalizerProcessFn;
      config?: FinalizerOptions;
    }> => {
      if (typeof finalizer === "string") {
        return {
          processFn: (await import(finalizer)).default,
        };
      } else if (Array.isArray(finalizer)) {
        const [path, finalizerConfig] = finalizer;
        return {
          processFn: (await import(path)).default,
          config: finalizerConfig,
        };
      }
      return finalizer;
    };

    const allFinalizers: Finalizer[] = await Promise.all(
      filteredFinalizers.map(async (finalizer) => {
        const result = await getProcessorFn(finalizer);
        const finalizerItem: Finalizer = {
          processFn: result.processFn,
        };
        if (result.config?.beforeProcess) {
          finalizerItem.preProcessFn = (
            await import(result.config.beforeProcess)
          ).default;
        }
        finalizerItem.config = result.config;
        return finalizerItem;
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
        const mergePluginWithDefaultOptions = (
          pluginDefinition: Plugin,
          options?: PluginOptions
        ) => {
          const defaultPluginOptions: Partial<Plugin> = {
            fileExtensions: [".ts"],
            options,
          };
          return merge(defaultPluginOptions, pluginDefinition);
        };

        if (typeof plugin === "string") {
          const pluginDefinition = (await import(plugin)).default;
          return mergePluginWithDefaultOptions(pluginDefinition);
        } else if (Array.isArray(plugin)) {
          const [path, options] = plugin;
          const pluginDefinition = (await import(path)).default;
          return mergePluginWithDefaultOptions(pluginDefinition, options);
        }
        return mergePluginWithDefaultOptions(plugin);
      })
    );
    return allPlugins;
  }
}
