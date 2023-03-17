import { ConfigModel } from "../shared/models/config.model";
import { merge } from "lodash";
import { DEFAULT_PLUGINS } from "./constants";
import { argv } from "../env";
import { BasePlugin } from "../plugins/analyze-plugin";
import { PluginOptions } from "../shared/models/plugin.model";

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
    const plugins = this.data.plugins ?? [];
    const pluginsInstances: BasePlugin[] = [];

    for (const pluginId in plugins) {
      let pluginConfig = plugins[pluginId];
      pluginConfig = (
        typeof pluginConfig === "string" ? {} : pluginConfig
      ) as PluginOptions;
      if (pluginConfig.disabled) {
        continue;
      }
      const pluginClass = (await import(pluginConfig.path)).default;
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
