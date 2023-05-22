import { htmlPlugin } from "./html-plugin";
import { typescriptPlugin } from "./typescript-plugin";
import jsonPlugin from "./json-plugin";
import { PluginsAnalyzeList } from "../../plugins/models/plugin-analyze";

export const pluginsAnalyzeList: PluginsAnalyzeList = {
  HTML: htmlPlugin,
  TypeScript: typescriptPlugin,
  JSON: jsonPlugin,
};
