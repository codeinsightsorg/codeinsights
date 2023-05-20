import {
  AnalyzerPlugin,
  PluginOptions,
} from "../shared/models/plugins/plugin.model";
import { Type } from "../shared/models/general.model";

interface IBasePlugin {
  plugin: AnalyzerPlugin;
  options: PluginOptions;
}

export class BasePlugin implements IBasePlugin {
  plugin: AnalyzerPlugin;

  constructor(
    public PluginClass: Type<AnalyzerPlugin>,
    public options: PluginOptions
  ) {
    this.plugin = new PluginClass();
    this.plugin.fileExtensions = this.getFileExtensions();
  }

  private getFileExtensions() {
    if (this.plugin.fileExtensions) {
      return;
    }
    if (this.plugin.parser === "TypeScript") {
      return [/\.ts$/, /\.js$/];
    }
    if (this.plugin.parser === "HTML") {
      return [/\.html$/, /^package.json$/];
    }
    if (this.plugin.parser === "JSON") {
      return [/^package.json$/];
    }
  }
}
