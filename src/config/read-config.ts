import { ConfigModel } from "../shared/models/config.model";
import { Config } from "./config";
import { argv } from "../env";

export async function readConfig(): Promise<Config> {
  const rootPath = argv.repoPath ?? "";
  const configName = argv.configName ?? "analyzer.config.json";
  const path = `${rootPath}/${configName}`;
  const configFromRepo = (await import(path)).default as ConfigModel;
  const config = new Config(configFromRepo);
  await config.init();
  return config;
}
