import { TSFilePlugin } from "../../plugins/ts-file";
import ImportsPlugin from "../../plugins/imports";
import { AnalyzerPlugin } from "../shared/models/plugin.model";
import { Type } from "../shared/models/general.model";
import ConsoleLogFinalizer from "../../plugins/console-log-finalizer";
import UsedHTMLTags from "../../plugins/used-html-tags";
import ChartJSPlugin from "../../plugins/ui/chartsjs-plugin";

export const MAIN_REPOS_FOLDER_PATH = "_repo";

export const DEFAULT_PLUGINS: Type<AnalyzerPlugin>[] = [
  TSFilePlugin,
  ImportsPlugin,
  ConsoleLogFinalizer,
  UsedHTMLTags,
  ChartJSPlugin,
];

export const DEFAULT_CONFIG_FILE_NAME = "analyzer.config.json";

export const CONFIG_FILE_NAMES = [
  DEFAULT_CONFIG_FILE_NAME,
  "analyzer.config.ts",
  "analyzer.config.js",
];
