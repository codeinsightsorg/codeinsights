import { readConfig } from "./config/read-config";
import { initAnalyzer } from "./analyzer/controller";
import { ConfigModel } from "./shared/models/config.model";
import { AnalyzeResults } from "./shared/models/analyze.model";

export async function init(configData?: ConfigModel): Promise<AnalyzeResults> {
  const config = await readConfig(configData);
  return await initAnalyzer(config);
}
