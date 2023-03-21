import fs from "fs/promises";
import { getAST } from "./utils";
import * as recast from "recast";
import { Config } from "../config/config";
import { getPluginsResult } from "../plugins";
import { BaseAnalyzeInfo } from "../shared/models/plugin.model";
import { JSDOM } from "jsdom";
import { BasePlugin } from "../plugins/analyze-plugin";
import { ParsingError } from "../shared/models/analyze.model";

export async function analyzeFiles(config: Config) {
  const plugins = config.plugins;
  const rootPath = config.data.repoPath as string;
  const parsingErrors: ParsingError[] = [];

  await _recursiveAnalyzeAllFiles(rootPath);

  return {
    results: getPluginsResult(plugins),
    parsingErrors,
  };

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
      if (fileName.startsWith(".")) {
        continue;
      }
      const lStat = await fs.lstat(fullPath);
      if (lStat.isDirectory()) {
        await _recursiveAnalyzeAllFiles(fullPath);
        continue;
      }
      const isSupportedFile = plugins.some((plugin) =>
        doesPluginMatchesFileName(plugin, fileName)
      );
      if (!isSupportedFile) {
        continue;
      }
      const fileString = (await fs.readFile(fullPath)).toString("utf-8");

      for (const basePlugin of plugins) {
        const plugin = basePlugin.plugin;
        if (!plugin.analyzeFile) {
          continue;
        }
        const baseAnalyzeInfo: BaseAnalyzeInfo = {
          file: {
            path: filePathFromRoot,
            contents: fileString,
            name: fileName,
          },
        };
        const isSpecifiedPluginExtension = doesPluginMatchesFileName(
          basePlugin,
          fileName
        );
        if (!isSpecifiedPluginExtension) {
          continue;
        }
        if (plugin.parser === "TypeScript") {
          let ast;
          try {
            ast = getAST(fileString, fileName);
          } catch (e) {
            continue;
          }
          ast.errors.forEach((error) => {
            parsingErrors.push({ error, fileName, fullPath });
          });
          plugin.analyzeFile(
            {
              ...baseAnalyzeInfo,
              ast,
              visit: (visitor) => recast.visit(ast, visitor),
              print: recast.print,
              prettyPrint: recast.prettyPrint,
            },
            basePlugin.options
          );
        } else if (plugin.parser === "HTML") {
          const dom = new JSDOM(fileString);
          plugin.analyzeFile(
            {
              ...baseAnalyzeInfo,
              document: dom.window.document,
              window: dom.window,
            },
            basePlugin.options
          );
        }
      }
    }
  }
}

function doesPluginMatchesFileName(plugin: BasePlugin, fileName: string) {
  return plugin.plugin.fileExtensions?.some((extension) =>
    fileName.endsWith(`.${extension}`)
  );
}
