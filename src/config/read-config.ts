import { ConfigModel } from "../shared/models/config.model";
import { Config } from "./config";
import { argv } from "../env";
import { CONFIG_FILE_NAMES } from "./constants";

export async function readConfig(): Promise<Config> {
  const rootPath = argv.repoPath ?? "";
  const configNameFromEnv = argv.configName;
  const paths = configNameFromEnv
    ? [`${rootPath}/${configNameFromEnv}`]
    : CONFIG_FILE_NAMES.map((name) => `${rootPath}/${name}`);
  const configFromRepo = await tryImport(paths);
  if (!configFromRepo) {
    throw new Error("Config not found");
  }
  const config = new Config(configFromRepo);
  await config.init();
  return config;
}

async function tryImport(files: string[]): Promise<ConfigModel | null> {
  for (const file of files) {
    try {
      const module = await import(file);
      return module.default;
    } catch (error) {
      console.error(`Failed to import module from ${file}:`, error);
    }
  }
  return null;
}
