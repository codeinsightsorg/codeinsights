import { AnalyzeResults } from "../shared/models/analyze.model";
import { BasePlugin } from "../plugins/analyze-plugin";

export async function processResults(
  this: any,
  result: AnalyzeResults,
  basePlugin: BasePlugin
) {
  if (!basePlugin.plugin.onAllFinishProcessing) {
    return;
  }
  basePlugin.plugin.onAllFinishProcessing(result, basePlugin.options?.params);
  // if (plugin.preProcessFn) {
  //   const processResult = await plugin.preProcessFn(result);
  //   plugin.onAllFinishProcessing(processResult, plugin?.config?.params);
  // } else {
  // }
}
