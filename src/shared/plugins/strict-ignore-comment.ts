import { BaseAnalyzerPlugin } from "../models/plugin.model";
import { AnalyzedEntityMetrics } from "../models/analyze.model";

interface StrictIgnoreFile {
  labels: {
    type: "file";
    name: string;
    path: string;
    hasStrictEnabled?: boolean;
  };
  metrics: AnalyzedEntityMetrics;
}

export class StrictIgnoreComment implements BaseAnalyzerPlugin {
  items: StrictIgnoreFile[] = [];

  analyzeFile({ file, helpers }) {
    const fileDefinition: StrictIgnoreFile = {
      labels: {
        type: "file",
        name: file.name,
        path: file.path,
      },
      metrics: {},
    };

    helpers.visit({
      visitComment: function (path) {
        const commentValue: string = path.value.value;
        const containsTsIgnore = commentValue.includes("@ts-strict-ignore");
        fileDefinition.labels.hasStrictEnabled = !containsTsIgnore;
        if (containsTsIgnore) {
          return false;
        } else {
          this.traverse(path);
        }
      },
    });

    if (!fileDefinition.labels.hasStrictEnabled) {
      fileDefinition.labels.hasStrictEnabled = false;
    }
    this.items.push(fileDefinition);
  }

  done() {
    return this.items;
  }
}

export default StrictIgnoreComment;
