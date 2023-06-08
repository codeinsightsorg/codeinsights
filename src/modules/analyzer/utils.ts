import { BasePlugin } from "./plugin-analyzer/analyze-plugin";

export function doesPluginMatchesFileName(
  plugin: BasePlugin,
  fileName: string
) {
  return plugin.instance.fileExtensions?.some((extension) =>
    extension.endsWith(fileName)
  );
}
