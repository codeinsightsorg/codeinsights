import { doesPluginMatchesFileName, getAST } from "./utils";
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
import TreeSitter from "tree-sitter";
import { getZip } from "./fetch-data";
const TreeSitterJSON = require("tree-sitter-json");

export async function analyzeFiles(config: Config) {
  const plugins = config.plugins;
  const rootPath = config.data.repoPath as string;
  const parsingErrors: ParsingError[] = [];
  const fileInformation: BaseFileInfoMap = {};

  const zip = await getZip(rootPath);
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
        if (plugin.parser === "JSON") {
          const object = JSON.parse(fileString);
          const treeSitter = new TreeSitter();
          treeSitter.setLanguage(TreeSitterJSON);
          const ast = treeSitter.parse(fileString);
          plugin.analyzeFile(
            {
              ...baseAnalyzeInfo,
              ast,
              object,
            },
            basePlugin.options
          );
        }
        if (plugin.parser === "TypeScript") {
          let ast: any;
          try {
            ast = getAST(fileString, fileName);
          } catch (e) {
            continue;
          }
          ast.errors.forEach((error: any) => {
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
