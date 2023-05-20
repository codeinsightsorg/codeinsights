import { TSFilePlugin } from "../../plugins/ts-file";
import ImportsPlugin from "../../plugins/imports";
import { AnalyzerPlugin } from "../shared/models/plugins/plugin.model";
import { Type } from "../shared/models/general.model";
import UsedHTMLTags from "../../plugins/used-html-tags";
import ChartJSPlugin from "../../plugins/chartsjs-plugin";
import DependenciesPlugin from "../../plugins/dependencies-plugin";

export const DEFAULT_PLUGINS: Type<AnalyzerPlugin>[] = [
  TSFilePlugin,
  ImportsPlugin,
  UsedHTMLTags,
  ChartJSPlugin,
  DependenciesPlugin,
];

export const DEFAULT_CONFIG_FILE_NAME = "analyzer.config.json";

export const CONFIG_FILE_NAMES = [
  DEFAULT_CONFIG_FILE_NAME,
  "analyzer.config.ts",
  "analyzer.config.js",
];
