#!/usr/bin/env node
import { readConfig } from "./config/read-config";
import { initAnalyzer } from "./analyzer/controller";

async function init() {
  const config = await readConfig();
  const result = await initAnalyzer(config);
  console.log(JSON.stringify(result, null, 2));
}

init().then();

export { ConfigModel } from "./shared/models/config.model";
