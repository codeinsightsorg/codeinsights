import { AnalyzerPlugin, PluginOptions } from "../shared/models/plugin.model";
import { Type } from "../shared/models/general.model";

interface IBasePlugin {
  plugin: AnalyzerPlugin;
  options: PluginOptions;
}

const defaultPlugin: Partial<AnalyzerPlugin> = {
  fileExtensions: [".ts"],
};

export class BasePlugin implements IBasePlugin {
  plugin: AnalyzerPlugin;

  constructor(
    private PluginClass: Type<AnalyzerPlugin>,
    public options: PluginOptions
  ) {
    this.plugin = new PluginClass();
    if (!this.plugin.fileExtensions) {
      this.plugin.fileExtensions = defaultPlugin.fileExtensions;
    }
  }
}
