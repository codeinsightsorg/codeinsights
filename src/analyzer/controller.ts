import { analyzeFiles } from "./analyzer";
import { processResults } from "./process";
import { Config } from "../config/config";
import { omit } from "lodash";
import { AnalyzedEntity } from "../shared/models/analyze.model";

export async function initAnalyzer(config: Config) {
  const analyzeResult = await analyzeFiles(config);

  for (const item of analyzeResult.results) {
    item.data = item.data.map((analyzed) => {
      return {
        ...analyzed,
        baseInfo: {
          ...analyzed.baseInfo,
          labels: omit(analyzed.baseInfo.labels, ["fileContents"]),
        },
      } as AnalyzedEntity;
    });
    item.allPluginsData = await processResults(analyzeResult, item.plugin);
  }

  return analyzeResult;
}
