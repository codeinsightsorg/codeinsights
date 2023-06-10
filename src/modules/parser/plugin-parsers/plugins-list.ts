import { htmlPlugin } from "./html-plugin";
import { typescriptPlugin } from "./typescript-plugin";
import jsonPlugin from "./json-plugin";
import { PluginAnalyzeFunction } from "../../plugins/models/plugin-analyze";
import { AnalyzerPlugin } from "../../../shared/models/plugins";
import { HTMLPlugin, JSONPlugin, TypeScriptPlugin } from "../../plugins";

export function getPluginParsingFunction(
  instance: AnalyzerPlugin
): PluginAnalyzeFunction | void {
  if (instance instanceof TypeScriptPlugin) {
    return typescriptPlugin;
  }
  if (instance instanceof HTMLPlugin) {
    return htmlPlugin;
  }
  if (instance instanceof JSONPlugin) {
    return jsonPlugin;
  }
}
