import { BaseAnalyzerPluginModel } from "./plugin.model";
import { BaseAnalyzeInfo } from "../analyze.model";
import { DOMWindow } from "jsdom";

export interface HTMLPluginModel
  extends BaseAnalyzerPluginModel<HTMLAnalyzeInfo> {}

export interface HTMLAnalyzeInfo extends BaseAnalyzeInfo {
  window: DOMWindow;
  document: Document;
}
