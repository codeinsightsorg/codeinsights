import TreeSitter from "tree-sitter";
import { IPluginAnalyzeInfo } from "../../plugins/models/plugin-analyze";
const TreeSitterJSON = require("tree-sitter-json");
export default function jsonPlugin(info: IPluginAnalyzeInfo) {
  const object = JSON.parse(info.fileContents);
  const treeSitter = new TreeSitter();
  treeSitter.setLanguage(TreeSitterJSON);
  const ast = treeSitter.parse(info.fileContents);
  return {
    ast,
    object,
  };
}
