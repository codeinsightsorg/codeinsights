import { AnalyzeResults } from "../src/shared/models/analyze.model";
import { BaseAnalyzerPlugin } from "../src/shared/models/plugin.model";

export class ConsoleLogFinalizer implements BaseAnalyzerPlugin {
  onAllFinishProcessing(items: AnalyzeResults) {
    console.log(items);
  }
}

export default ConsoleLogFinalizer;
