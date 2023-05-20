import { AnalyzeResults } from "../src/shared/models/analyze.model";
import { BaseAnalyzerPlugin } from "../src/shared/models/plugins/plugin.model";

export class ConsoleLogFinalizer implements BaseAnalyzerPlugin {
  onAllFinishProcessing(items: AnalyzeResults) {
    console.log(JSON.stringify(items, null, 2));
  }
}

export default ConsoleLogFinalizer;
