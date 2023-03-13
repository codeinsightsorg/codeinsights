import { AnalyzeResults } from "../models/analyze.model";
import { AnalyzerPlugin } from "../models/plugin.model";

export class ConsoleLogFinalizer implements AnalyzerPlugin {
  onAllFinishProcessing(items: AnalyzeResults) {
    console.log(items);
  }
}

export default ConsoleLogFinalizer;
