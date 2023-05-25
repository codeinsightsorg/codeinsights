import { ConfigModel, ConfigPluginModel } from "../shared/models/config.model";
import { merge } from "lodash";
import { DEFAULT_PLUGINS } from "./constants";
import { argv } from "../env";
import { BasePlugin } from "../modules/analyzer/plugin-analyzer/analyze-plugin";
import { PluginOptions } from "../shared/models/plugins/plugin.model";
import path from "path";
import { supportedPlugins } from "../shared/plugins/constants/plugins.constants";

export class Config {
  data: ConfigModel;
  plugins!: BasePlugin[];

  constructor(config: ConfigModel) {
    const defaultConfig: ConfigModel = {
      repoPath: argv.repoPath ?? "./",
    };
    this.data = merge(defaultConfig, config);
  }

  async init() {
    this.plugins = await this.getAllPlugins();
  }

  private async getAllPlugins(): Promise<BasePlugin[]> {
    const plugins = (this.data.plugins ??
      argv.plugins?.split(",") ??
      []) as ConfigPluginModel[];
    const pluginsInstances: BasePlugin[] = [];

    for (const plugin of plugins) {
      const pluginPath = typeof plugin === "string" ? plugin : plugin.path;
      const isSupportedPlugin = !!supportedPlugins[pluginPath];
      let pluginConfig = plugin;
      if (typeof pluginConfig === "string") {
        pluginConfig = {
          path: pluginConfig,
        } as PluginOptions;
      }
      if (pluginConfig.disabled) {
        continue;
      }
      let pluginClass = supportedPlugins[pluginPath];
      if (!isSupportedPlugin) {
        pluginClass = (await import(pluginConfig.path)).default;
      }
      if (pluginConfig.disabled) {
        continue;
      }
      const pluginInstance = new BasePlugin(pluginClass, pluginConfig);
      pluginsInstances.push(pluginInstance);
    }

    for (const plugin of DEFAULT_PLUGINS) {
      const instance = new BasePlugin(plugin, {} as PluginOptions);
      pluginsInstances.push(instance);
    }

    return pluginsInstances;
  }
}
