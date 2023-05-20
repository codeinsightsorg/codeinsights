import { BaseAnalyzerPlugin } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import { DOMWindow } from "jsdom";

export interface HTMLPlugin extends BaseAnalyzerPlugin<HTMLAnalyzeInfo> {
  parser: "HTML";
}

export interface HTMLAnalyzeInfo extends BaseAnalyzeInfo {
  window: DOMWindow;
  document: Document;
}
