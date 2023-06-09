import { BaseAnalyzerPlugin } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import { SFCParseResult } from "@vue/compiler-sfc";

export interface VuePluginModel extends BaseAnalyzerPlugin<VueAnalyzeInfo> {
  parser: "Vue3";
}

export interface VueAnalyzeInfo extends BaseAnalyzeInfo {
  ast: SFCParseResult;
}
