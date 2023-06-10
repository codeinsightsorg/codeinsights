import { AnalyzerPlugin, PluginOptions } from "../../../shared/models/plugins";
import { Type } from "../../../shared/models/general.model";
import { TypeScriptPlugin } from "../../plugins/typescript-plugin";
import { HTMLPlugin, JSONPlugin } from "../../plugins";

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
    if (this.instance instanceof TypeScriptPlugin) {
      return [".ts", ".js"];
    }
    if (this.instance instanceof HTMLPlugin) {
      return [".html"];
    }
    if (this.instance instanceof JSONPlugin) {
      return [".json"];
    }
  }
}
