import { AnalyzeResults } from "./analyze.model";

export interface FinalizerOptions {
  beforeProcess?: string;
  disabled?: boolean;
  params?: any;
}

export type FinalizerProcessFn = (items: AnalyzeResults, ...args: any[]) => any;
export type FinalizerPreProcessFn = (items: AnalyzeResults) => any;

export interface Finalizer {
  processFn: FinalizerProcessFn;
  config?: FinalizerOptions;
  preProcessFn?: FinalizerPreProcessFn;
}
