import { TSFilePlugin } from "../shared/plugins/ts-file";
import ImportsPlugin from "../shared/plugins/imports";
import { AnalyzerPlugin } from "../shared/models/plugin.model";
import { Type } from "../shared/models/general.model";

export const DEFAULT_PLUGINS: Type<AnalyzerPlugin>[] = [
  TSFilePlugin,
  ImportsPlugin,
];

export const DEFAULT_CONFIG_FILE_NAME = "analyzer.config.json";

export const CONFIG_FILE_NAMES = [
  DEFAULT_CONFIG_FILE_NAME,
  "analyzer.config.ts",
  "analyzer.config.ts",
];
