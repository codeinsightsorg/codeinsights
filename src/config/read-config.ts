import { ConfigModel } from "../shared/models/config.model";
import { Config } from "./config";
import { argv } from "../env";
import { CONFIG_FILE_NAMES } from "./constants";
import { tryImport } from "../shared/utils/fs.utils";

export async function readConfig(configData?: ConfigModel): Promise<Config> {
  const repoPath = argv.repoPath ?? configData?.repoPath ?? "";
  let configFromRepo: ConfigModel = configData ?? {};
  configFromRepo = {
    useDefaultPlugins: configFromRepo?.useDefaultPlugins ?? true,
    ...configFromRepo,
  };
  const importResult = await fetchConfigFromFolder(repoPath);
  if (importResult) {
    configFromRepo = importResult;
  }
  configFromRepo = {
    ...configFromRepo,
    repoPath: repoPath ?? argv.repoPath,
  };
  const config = new Config(configFromRepo);
  await config.init();
  return config;
}

async function fetchConfigFromFolder(repoPath: string) {
  const configNameFromEnv = argv.configName;
  const paths = configNameFromEnv
    ? [`${repoPath}/${configNameFromEnv}`]
    : CONFIG_FILE_NAMES.map((name) => `${repoPath}/${name}`);
  const importResult = await tryImport<ConfigModel>(paths);
  return importResult;
}
