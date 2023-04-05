import { AnalyzeResults } from "../shared/models/analyze.model";
import { BasePlugin } from "../plugins/analyze-plugin";

export async function processResults(
  result: AnalyzeResults,
  basePlugin: BasePlugin
) {
  if (!basePlugin.plugin.onAllFinishProcessing) {
    return;
  }
  let data = result;

  const onAllFinishBeforeHook =
    basePlugin.options?.beforeHooks?.onAllFinishProcessing;
  if (onAllFinishBeforeHook) {
    const preProcessFn = (await import(onAllFinishBeforeHook)).default;
    data = preProcessFn(result);
  }
  basePlugin.plugin.onAllFinishProcessing(data, basePlugin);
}
