import { analyzeFiles } from "./analyzer";
import { processResults } from "./process";
import { Config } from "../config/config";

export async function initAnalyzer(config: Config) {
  const result = await analyzeFiles(config);
  await processResults(result, config.finalizers);
  console.log(`Finished running`);
}
