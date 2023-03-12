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
      finalizer.processFn(processResult, finalizer?.config?.params);
    } else {
      finalizer.processFn(result, finalizer?.config?.params);
    }
  }
}
