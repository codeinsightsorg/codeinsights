#!/usr/bin/env node
import { readConfig } from "./config/read-config";
import { initAnalyzer } from "./analyzer/controller";

async function init() {
  const config = await readConfig();
  await initAnalyzer(config);
}

init().then();

export { ConfigModel } from "./shared/models/config.model";
