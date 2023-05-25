import { AnalyzeResults } from "../models/analyze.model";
import { BaseAnalyzerPlugin } from "../models/plugins/plugin.model";

export class ConsoleLogFinalizer implements BaseAnalyzerPlugin {
  onAllFinishProcessing(items: AnalyzeResults) {
    console.log(JSON.stringify(items, null, 2));
  }
}

export default ConsoleLogFinalizer;
