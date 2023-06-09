import { Parser } from "../../../shared/models/plugins";

export interface IPluginAnalyzeInfo {
  fileContents: string;
  fileName: string;
  path: string;
}

export type PluginAnalyzeFunction = (
  info: IPluginAnalyzeInfo
) => Record<string, any>;

export type PluginsAnalyzeList = Record<Parser, PluginAnalyzeFunction>;
