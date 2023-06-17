import { htmlPlugin } from "./plugin-parsers/html-plugin";
import { typescriptPlugin } from "./plugin-parsers/typescript-plugin";
import jsonPlugin from "./plugin-parsers/json-plugin";

export function parseByFilename(fileName: string) {
  if (fileName.endsWith(".html")) {
    return htmlPlugin;
  }
  if (fileName.endsWith(".ts") || fileName.endsWith(".js")) {
    return typescriptPlugin;
  }
  if (fileName.endsWith(".json")) {
    return jsonPlugin;
  }
}
