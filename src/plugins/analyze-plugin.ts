import { AnalyzerPlugin, PluginOptions } from "../shared/models/plugin.model";
import { Type } from "../shared/models/general.model";

export class BasePlugin {
  plugin: AnalyzerPlugin;

  constructor(
    private PluginClass: Type<AnalyzerPlugin>,
    public options?: PluginOptions
  ) {
    this.plugin = new PluginClass();
  }
}
