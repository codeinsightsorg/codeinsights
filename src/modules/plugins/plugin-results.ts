import { BasePlugin } from "../parser/plugin-parsers/analyze-plugin";
import {
  AnalyzeResultPlugin,
  BaseFileInfoMap,
} from "../../shared/models/analyze.model";

export function getPluginsResult(
  plugins: BasePlugin[],
  fileMap: BaseFileInfoMap
) {
  const pluginResults: AnalyzeResultPlugin[] = [];
  plugins.forEach((plugin) => {
    plugin.instance.name = plugin.sourceClass.name;

    if (plugin.instance?.onFinishProcessing) {
      const result = plugin.instance.onFinishProcessing();
      const pluginResult: AnalyzeResultPlugin = {
        pluginData: result.map((item) => {
          return {
            file: fileMap[item.path],
            analyzed: item,
          };
        }),
        name: plugin.sourceClass.name,
        plugin: plugin,
      };
      pluginResults.push(pluginResult);
    } else {
      pluginResults.push({
        pluginData: [],
        plugin: plugin,
        name: plugin.sourceClass.name,
      });
    }
  });

  return pluginResults;
}
