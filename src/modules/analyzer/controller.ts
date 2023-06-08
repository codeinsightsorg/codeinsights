import { analyzeFiles } from "./analyzer";
import { processResults } from "./process";
import { Config } from "../../config/config";
import { omit } from "lodash";
import {
  AnalyzedEntity,
  AnalyzeResults,
} from "../../shared/models/analyze.model";

export async function initAnalyzer(config: Config): Promise<AnalyzeResults> {
  const analyzeResult = await analyzeFiles(config);

  for (const item of analyzeResult.plugins) {
    item.pluginData = item.pluginData.map((analyzed) => {
      return {
        ...analyzed,
        file: {
          ...analyzed.file,
          labels: omit(analyzed.file.labels, ["fileContents"]),
        },
      } as AnalyzedEntity;
    });
  }

  for (const item of analyzeResult.plugins) {
    item.allPluginsData = await processResults(analyzeResult, item.plugin);
  }

  return analyzeResult;
}
