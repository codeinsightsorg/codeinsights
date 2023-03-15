import { AnalyzeResults } from "../models/analyze.model";
import { BaseAnalyzerPlugin } from "../models/plugin.model";

export class ConsoleLogFinalizer implements BaseAnalyzerPlugin {
  onAllFinishProcessing(items: AnalyzeResults) {
    console.log(items);
  }
}

export default ConsoleLogFinalizer;
