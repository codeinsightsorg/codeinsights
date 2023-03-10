import { Visitor } from "ast-types/gen/visitor";

export interface AnalyzeMetadata {
  file: {
    path: string;
    name: string;
    contents: string;
  };
  ast: any;
  helpers: {
    visit: (visitor: Visitor) => any;
  };
}

export interface Plugin {
  id: string;
  analyze: (accumulator: any, metadata: AnalyzeMetadata) => any;
  fileExtensions?: string[];
  initialAccumulator?: any;
  parser?: any;
  done?: (items: any) => any;
}

export interface PluginOptions {
  disabled?: boolean;
}
