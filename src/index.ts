#!/usr/bin/env node
import { readConfig } from "./config/read-config";
import { initAnalyzer } from "./modules/analyzer/controller";

async function init() {
  const config = await readConfig();
  const result = await initAnalyzer(config);
  console.log(JSON.stringify(result, null, 2));
}

init().then();

export { ConfigModel, ConfigPluginModel } from "./shared/models/config.model";
export * from "./shared/models/plugins/index";
export * from "./shared/models/analyze.model";
export * from "./modules/plugins/index";
export { BasePlugin } from "./modules/parser/plugin-parsers/analyze-plugin";
