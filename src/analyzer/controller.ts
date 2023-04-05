import { analyzeFiles } from "./analyzer";
import { processResults } from "./process";
import { Config } from "../config/config";

export async function initAnalyzer(config: Config) {
  const analyzeResult = await analyzeFiles(config);

  for (const item of analyzeResult.results) {
    item.allPluginsData = await processResults(analyzeResult, item.plugin);
  }

  return analyzeResult;
}
