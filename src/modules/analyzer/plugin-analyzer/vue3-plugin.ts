import { IPluginAnalyzeInfo } from "../../plugins/models/plugin-analyze";
import * as vueParser from "@vue/compiler-sfc";
export default function vue3Plugin(info: IPluginAnalyzeInfo) {
  const ast = vueParser.parse(info.fileContents);
  return {
    ast,
  };
}
