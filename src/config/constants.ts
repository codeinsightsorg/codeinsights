import { typescriptFilePlugin } from "../shared/plugins/ts-file";
import { Finalizer } from "../shared/models/finalizer.model";
import { importPlugin } from "../shared/plugins/imports";

export const DEFAULT_PLUGINS = [typescriptFilePlugin, importPlugin];

export const DEFAULT_FINALIZERS: Finalizer[] = [];

export const DEFAULT_CONFIG_FILE_NAME = "analyzer.config.json";

export const CONFIG_FILE_NAMES = [
  DEFAULT_CONFIG_FILE_NAME,
  "analyzer.config.ts",
  "analyzer.config.ts",
];
