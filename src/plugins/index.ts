import { Plugin, PluginsContextMap } from "../shared/models/plugin.model";
import {
  AnalyzeResultItem,
  AnalyzeResults,
} from "../shared/models/analyze.model";

export function getPluginsContext(plugins: Plugin[]) {
  return plugins.reduce((pluginsContextMap: PluginsContextMap, plugin) => {
    pluginsContextMap[plugin.id] = plugin.analyze(plugin.options?.params);
    return pluginsContextMap;
  }, {});
}

export function getPluginsResult(
  plugins: Plugin[],
  pluginsContext: PluginsContextMap
) {
  const pluginResults: AnalyzeResults = [];
  plugins.forEach((plugin) => {
    const context = pluginsContext[plugin.id];
    const result = context.done();
    const pluginResult: AnalyzeResultItem = {
      result,
      id: plugin.id,
    };
    pluginResults.push(pluginResult);
  });
  return pluginResults;
}
