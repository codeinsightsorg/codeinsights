import fs from "fs/promises";
import { getAST } from "./utils";
import { AnalyzeMetadata } from "../shared/models/plugin.model";
import * as recast from "recast";
import { Config } from "../config/config";

type FlatResult = any;

type AnalyzeResult = Record<string, any> | FlatResult;

export async function analyzeFiles(config: Config): Promise<AnalyzeResult> {
  const plugins = config.plugins;
  const pluginsMap: Record<string, any> = {};
  const rootPath = config.data.repoPath as string;

  await _recursiveAnalyzeAllFiles(rootPath);

  plugins.forEach((plugin) => {
    if (plugin.done) {
      const pluginData = pluginsMap[plugin.id];
      pluginsMap[plugin.id] = plugin.done(pluginData);
    }
  });

  if (config.data.flattenOutput) {
    return Object.values(pluginsMap).flat();
  }

  return pluginsMap;

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
        if (!pluginsMap[plugin.id]) {
          pluginsMap[plugin.id] = plugin.initialAccumulator;
        }
        const pluginAccumulator = pluginsMap[plugin.id];
        if (plugin.fileExtensions?.every((ext) => !fileName.endsWith(ext))) {
          continue;
        }

        const ast = getAST(fileString, plugin.parser);
        const metadata: AnalyzeMetadata = {
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

        pluginsMap[plugin.id] = plugin.analyze(pluginAccumulator, metadata);
      }
    }
  }
}
