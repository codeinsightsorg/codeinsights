export interface IPluginAnalyzeInfo {
  fileContents: string;
  fileName: string;
  path: string;
}

export type PluginAnalyzeFunction = (
  info: IPluginAnalyzeInfo
) => Record<string, any>;
