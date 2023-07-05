import { doesPluginMatchesFileName } from "./utils";
import { Config } from "../../config/config";
import {
  AnalyzeResults,
  BaseAnalyzeInfo,
  BaseFileInfoMap,
} from "../../shared/models/analyze.model";
import AdmZip from "adm-zip";
import { escapeRegExp } from "lodash";
import { getRepoZip } from "../repo-data/repo-data";
import { getPluginParsingFunction } from "../parser/plugin-parsers/plugins-list";
import { getPluginsResult } from "../plugins/plugin-results";

export async function analyzeFiles(config: Config): Promise<AnalyzeResults> {
  const plugins = config.plugins;
  const rootPath = config.data.repoPath as string;
  const fileInformation: BaseFileInfoMap = {};

  const zip = await getRepoZip(rootPath);
  await analyzeAllFilesFromZip(zip);

  return {
    plugins: getPluginsResult(plugins, fileInformation),
  };

  async function analyzeAllFilesFromZip(zip: AdmZip) {
    for (const file of zip.getEntries()) {
      const fileName = file.name;
      const fullPath = `${rootPath}/${fileName}`;
      const filePathFromRoot = fullPath.replace(`${config.data.repoPath}/`, "");
      if (
        config.data.ignoreFolders &&
        config.data.ignoreFolders.some((folder) => {
          const re = new RegExp(escapeRegExp(folder));
          return re.test(folder);
        })
      ) {
        continue;
      }
      const isHiddenFile = fileName.startsWith(".");
      if (isHiddenFile) {
        continue;
      }
      const isSupportedFile = plugins.some((plugin) =>
        doesPluginMatchesFileName(plugin, fileName)
      );
      if (!isSupportedFile) {
        continue;
      }
      const fileString = file.getData().toString("utf-8");
      if (!fileString) {
        // todo: add error to list
        continue;
      }
      const loc = fileString.split("\n").length;

      for (const basePlugin of plugins) {
        const plugin = basePlugin.instance;
        if (!plugin.analyzeFile) {
          continue;
        }
        const baseAnalyzeInfo: BaseAnalyzeInfo = {
          path: filePathFromRoot,
          type: "file",
          labels: {
            filePath: filePathFromRoot,
            fileName: fileName,
            fileContents: fileString,
          },
          metrics: {
            fileLinesOfCode: loc,
          },
        };
        fileInformation[filePathFromRoot] = baseAnalyzeInfo;
        const isSpecifiedPluginExtension = doesPluginMatchesFileName(
          basePlugin,
          fileName
        );
        if (!isSpecifiedPluginExtension) {
          continue;
        }
        try {
          const analyzePlugin = getPluginParsingFunction(plugin);
          if (!analyzePlugin) continue;
          const pluginMetadata = analyzePlugin({
            fileContents: fileString,
            path: fullPath,
            fileName,
          });
          plugin.analyzeFile(
            {
              ...pluginMetadata,
              ...baseAnalyzeInfo,
            },
            basePlugin.options
          );
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}
