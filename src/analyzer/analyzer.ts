import fs from "fs/promises";
import { getAST } from "./utils";
import { AnalyzeInfo } from "../shared/models/plugin.model";
import * as recast from "recast";
import { Config } from "../config/config";
import { getPluginsContext, getPluginsResult } from "../plugins";

type FlatResult = any;

type AnalyzeResult = Record<string, any> | FlatResult;

export async function analyzeFiles(config: Config): Promise<AnalyzeResult> {
  const plugins = config.plugins;
  const pluginsContext = getPluginsContext(plugins);
  const rootPath = config.data.repoPath as string;

  await _recursiveAnalyzeAllFiles(rootPath);

  return getPluginsResult(plugins, pluginsContext);

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

      for (const plugin of plugins) {
        const context = pluginsContext[plugin.id];
        if (plugin.fileExtensions?.every((ext) => !fileName.endsWith(ext))) {
          continue;
        }
        const ast = getAST(fileString, plugin.parser);
        const analyzeInfo: AnalyzeInfo = {
          ast,
          file: {
            path: filePathFromRoot,
            contents: fileString,
            name: fileName,
          },
          helpers: {
            visit: (visitor) => recast.visit(ast, visitor),
          },
        };
        context.analyzeFile(analyzeInfo);
      }
    }
  }
}
