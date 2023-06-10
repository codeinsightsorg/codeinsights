import { JSDOM } from "jsdom";
import { IPluginAnalyzeInfo } from "../../plugins/models/plugin-analyze";

export function htmlPlugin(info: IPluginAnalyzeInfo) {
  const dom = new JSDOM(info.fileContents);
  return {
    document: dom.window.document,
    window: dom.window,
  };
}
