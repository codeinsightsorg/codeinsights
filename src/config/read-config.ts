import { ConfigModel } from "../shared/models/config.model";
import { Config } from "./config";
import { argv } from "../env";
import { CONFIG_FILE_NAMES, MAIN_REPOS_FOLDER_PATH } from "./constants";
import isURL from "is-url";
import { tryImport } from "../shared/utils/fs.utils";
const path = require("path");
const { execSync } = require("child_process");
import fs from "fs";

export async function readConfig(configData?: ConfigModel): Promise<Config> {
  const dir = path.join(process.cwd(), MAIN_REPOS_FOLDER_PATH);
  let repoPath = argv.repoPath ?? configData?.repoPath ?? "";
  let configFromRepo: ConfigModel = configData ?? {};
  const useCachedRepo = argv.useCachedRepo || configData?.useCachedRepo;

  if (repoPath.startsWith("https://github.com") && isURL(repoPath)) {
    if (!fs.existsSync(dir) || !useCachedRepo) {
      fetchRepoFromURL(repoPath, dir);
    }
    repoPath = dir;
  } else {
    const importResult = await fetchConfigFromFolder(repoPath);
    if (importResult) {
      configFromRepo = importResult;
    }
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

function fetchRepoFromURL(repoPath: string, dir: string) {
  execSync(`rm -rf ${dir}`, { stdio: "inherit" });
  execSync(`git clone ${repoPath} ${dir}`, { stdio: "inherit" });
}
