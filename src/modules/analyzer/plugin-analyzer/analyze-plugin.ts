import { AnalyzerPlugin, PluginOptions } from "../../../shared/models/plugins";
import { Type } from "../../../shared/models/general.model";

interface IBasePlugin {
  instance: AnalyzerPlugin;
  options: PluginOptions;
}

export class BasePlugin implements IBasePlugin {
  instance: AnalyzerPlugin;
  sourceClass: Type<AnalyzerPlugin>;

  constructor(
    private PluginClass: Type<AnalyzerPlugin>,
    public options: PluginOptions
  ) {
    this.sourceClass = PluginClass;
    this.instance = new PluginClass();
    this.instance.fileExtensions = this.getFileExtensions();
  }

  private getFileExtensions() {
    if (this.instance.fileExtensions) {
      return;
    }
    switch (this.instance.parser) {
      case "TypeScript":
        return [".ts", ".js"];
      case "HTML":
        return [".html"];
      case "JSON":
        return [".json"];
      case "Vue3":
        return [".vue"];
    }
  }
}
