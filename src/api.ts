import { readConfig } from "./config/read-config";
import { initAnalyzer } from "./analyzer/controller";
import { ConfigModel } from "./shared/models/config.model";

export async function init(configData?: ConfigModel) {
  const config = await readConfig(configData);
  return await initAnalyzer(config);
}
