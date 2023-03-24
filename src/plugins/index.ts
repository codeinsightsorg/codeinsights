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
    if (plugin.plugin?.onFinishProcessing) {
      const result = plugin.plugin.onFinishProcessing();
      const pluginResult: AnalyzeResultItem = {
        result: result.map((item) => {
          return {
            baseInformation: fileMap[item.path],
            result: item,
          };
        }),
        plugin,
      };
      pluginResults.push(pluginResult);
    }
  });
  return pluginResults;
}
