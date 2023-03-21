import { analyzeFiles } from "./analyzer";
import { processResults } from "./process";
import { Config } from "../config/config";

export async function initAnalyzer(config: Config) {
  const analyzeResult = await analyzeFiles(config);

  for (const plugin of config.plugins) {
    await processResults(analyzeResult.results, plugin);
  }

  console.log(`Finished running`);
}
