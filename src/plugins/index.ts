import {
  AnalyzeResultItem,
  BaseFileInfoMap,
} from "../shared/models/analyze.model";
import { BasePlugin } from "./analyze-plugin";

export function getPluginsResult(
  plugins: BasePlugin[],
  fileMap: BaseFileInfoMap
) {
  const pluginResults: AnalyzeResultItem[] = [];
  plugins.forEach((plugin) => {
    plugin.plugin.name = plugin.PluginClass.name;
    if (plugin.plugin?.onFinishProcessing) {
      const result = plugin.plugin.onFinishProcessing();
      const pluginResult: AnalyzeResultItem = {
        data: result.map((item) => {
          return {
            baseInfo: fileMap[item.path],
            analyzed: item,
          };
        }),
        plugin,
      };
      pluginResults.push(pluginResult);
    }
  });
  return pluginResults;
}
