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
    plugin.instance.name = plugin.sourceClass.name;

    if (plugin.instance?.onFinishProcessing) {
      const result = plugin.instance.onFinishProcessing();
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
    } else {
      pluginResults.push({
        data: [],
        plugin,
      });
    }
  });

  return pluginResults;
}
