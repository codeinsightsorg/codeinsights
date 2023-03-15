import fs from "fs/promises";
import { getAST } from "./utils";
import * as recast from "recast";
import { Config } from "../config/config";
import { getPluginsResult } from "../plugins";
import { BaseAnalyzeInfo } from "../shared/models/plugin.model";

type FlatResult = any;

type AnalyzeResult = Record<string, any> | FlatResult;

export async function analyzeFiles(config: Config): Promise<AnalyzeResult> {
  const plugins = config.plugins;
  const rootPath = config.data.repoPath as string;

  await _recursiveAnalyzeAllFiles(rootPath);

  return getPluginsResult(plugins);

  async function _recursiveAnalyzeAllFiles(rootPath: string) {
    const filesNames = await fs.readdir(rootPath);

    for (const fileName of filesNames) {
      const fullPath = `${rootPath}/${fileName}`;
      const filePathFromRoot = fullPath.replace(`${config.data.repoPath}/`, "");
      if (
        config.data.ignoreFolders &&
        config.data.ignoreFolders.includes(filePathFromRoot)
      ) {
        continue;
      }
      const lStat = await fs.lstat(fullPath);
      if (lStat.isDirectory()) {
        await _recursiveAnalyzeAllFiles(fullPath);
        continue;
      }
      const fileString = (await fs.readFile(fullPath)).toString("utf-8");

      for (const basePlugin of plugins) {
        const plugin = basePlugin.plugin;
        if (
          !plugin.analyzeFile ||
          plugin.fileExtensions?.every((ext) => !fileName.endsWith(ext))
        ) {
          continue;
        }
        const ast = getAST(fileString);
        const baseAnalyzeInfo: BaseAnalyzeInfo = {
          ast,
          file: {
            path: filePathFromRoot,
            contents: fileString,
            name: fileName,
          },
        };
        if (plugin.parser === "TypeScript") {
          plugin.analyzeFile({
            ...baseAnalyzeInfo,
            visit: (visitor) => recast.visit(ast, visitor),
          });
        }
        if (plugin.parser === "HTML") {
          // plugin.analyzeFile(baseAnalyzeInfo);
        }
      }
    }
  }
}
