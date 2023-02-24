import {analyzeFiles} from "./analyzer";
import {config} from "../config/config";

export async function initAnalyzer() {
  const result = await analyzeFiles();

  const postProcessors = config.getAllPostProcessors();
  for (const processor of postProcessors) {
    if (Array.isArray(processor)) {
      const [processorFn, options] = processor;
      const data = options?.beforeProcess?.(result) || result;
      await processorFn(data);
    } else {
      await processor(result);
    }
  }

  console.log(`Finished running`)
}
