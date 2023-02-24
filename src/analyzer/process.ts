import { Finalizer } from "../shared/models/finalizer.model";

export async function processResults(result: any, finalizers: Finalizer[]) {
  for (const processor of finalizers) {
    if (Array.isArray(processor)) {
      const [processorFn, options] = processor;
      const data = options?.beforeProcess?.(result) || result;
      await processorFn(data);
    } else {
      await processor(result);
    }
  }
}
