import { AnalyzeResults } from "../../shared/models/analyze.model";
import { BasePlugin } from "../parser/plugin-parsers/analyze-plugin";

export async function processResults(
  result: AnalyzeResults,
  basePlugin: BasePlugin
) {
  if (!basePlugin.instance.onAllFinishProcessing) {
    return [];
  }
  let data = result;

  const onAllFinishBeforeHook =
    basePlugin.options?.beforeHooks?.onAllFinishProcessing;
  if (onAllFinishBeforeHook) {
    const preProcessFn = (await import(onAllFinishBeforeHook)).default;
    data = preProcessFn(result);
  }
  return basePlugin.instance.onAllFinishProcessing(data, basePlugin);
}
