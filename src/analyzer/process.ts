import { Finalizer } from "../shared/models/finalizer.model";
import { AnalyzeResults } from "../shared/models/analyze.model";

export async function processResults(
  this: any,
  result: AnalyzeResults,
  finalizers: Finalizer[]
) {
  for (const finalizer of finalizers) {
    if (finalizer.preProcessFn) {
      const processResult = await finalizer.preProcessFn(result);
      finalizer.processFn.call(this, processResult, finalizer?.config?.params);
    } else {
      finalizer.processFn.call(this, result, finalizer?.config?.params);
    }
  }
}
