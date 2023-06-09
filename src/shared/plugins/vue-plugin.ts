import { AnalyzedEntityMetrics } from "../models/analyze.model";
import {
  VueAnalyzeInfo,
  VuePluginModel,
} from "../models/plugins/vue-plugin.model";

interface Component {
  type: "component";
  path: string;
  metrics: AnalyzedEntityMetrics;
  labels: {
    selector: string;
    name: string;
  };
}

export default class VuePlugin implements VuePluginModel {
  items: Component[] = [];
  parser = "Vue3" as const;

  analyzeFile({ ast, labels }: VueAnalyzeInfo) {
    console.log(ast);
  }

  onFinishProcessing() {
    return this.items;
  }
}
