import { getAST } from "./utils";
import * as recast from "recast";
import { Config } from "../config/config";
import { getPluginsResult } from "../plugins";
import { JSDOM } from "jsdom";
import { BasePlugin } from "../plugins/analyze-plugin";
import {
  BaseAnalyzeInfo,
  BaseFileInfoMap,
  ParsingError,
} from "../shared/models/analyze.model";
import axios from "axios";
import AdmZip from "adm-zip";
import { escapeRegExp } from "lodash";

export async function analyzeFiles(config: Config) {
  const plugins = config.plugins;
  const rootPath = config.data.repoPath as string;
  const parsingErrors: ParsingError[] = [];
  const fileInformation: BaseFileInfoMap = {};

  const getZip = async () => {
    if (rootPath.startsWith("https://github.com")) {
      return await fetchRepoFromURL(rootPath);
    }
    const zip = new AdmZip();
    zip.addLocalFolder(rootPath);
    return zip;
  };

  const zip = await getZip();
  await analyzeAllFilesFromZip(zip);

  return {
    results: getPluginsResult(plugins, fileInformation),
    parsingErrors,
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
      if (fileName.startsWith(".")) {
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
        const plugin = basePlugin.plugin;
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

async function fetchRepoFromURL(repoPath: string) {
  const { name, user } = getGithubRepoDetailsFromURL(repoPath);
  const url = `https://api.github.com/repos/${user}/${name}/zipball`;
  const repo = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return new AdmZip(repo.data);
}

function getGithubRepoDetailsFromURL(query: string) {
  const [user, name] = query.split("/").slice(-2);
  return {
    user,
    name,
  };
}
