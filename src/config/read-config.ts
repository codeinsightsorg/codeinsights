import { ConfigModel } from "../shared/models/config.model";
import { Config } from "./config";
import { argv } from "../env";

export async function readConfig(): Promise<Config> {
  const rootPath = argv.repoPath ?? "";
  const configName = argv.configName ?? "analyzer.config.ts";
  const path = `${rootPath}/${configName}`;
  const configFromRepo = (await import(path)).default as ConfigModel;
  return new Config(configFromRepo);
}
