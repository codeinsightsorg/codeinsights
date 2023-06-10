import { BasePlugin } from "../parser/plugin-parsers/analyze-plugin";

export function doesPluginMatchesFileName(
  plugin: BasePlugin,
  fileName: string
) {
  return plugin.instance.fileExtensions?.some((extension) =>
    fileName.endsWith(extension)
  );
}
