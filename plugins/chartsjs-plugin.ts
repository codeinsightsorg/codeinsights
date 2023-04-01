import fs from "fs/promises";
import path from "path";
import { groupBy, pick } from "lodash";
import { BaseAnalyzerPlugin } from "../src/shared/models/plugin.model";
import { AnalyzeResults } from "../src/shared/models/analyze.model";

interface GenericChartDefinition {
  chartType: "line" | "bar" | "doughnut";
  key: string;
  labels: string[];
  values: number[];
}

interface ChartDataMap {
  [key: string]: GenericChartDefinition[];
}

export class ChartJSPlugin implements BaseAnalyzerPlugin {
  async onAllFinishProcessing({ results }: AnalyzeResults) {
    const pluginResults: {
      name: string;
      charts: Record<string, GenericChartDefinition[]>;
    }[] = [];

    results.forEach((pluginResult) => {
      const chartDataMap: ChartDataMap = {};
      const groupedByType = groupBy(
        pluginResult.data,
        (item) => item.analyzed.type
      );

      Object.entries(groupedByType).forEach(([type, items]) => {
        const charts: GenericChartDefinition[] = [];
        const countMap: Record<string, Record<string, number>> = {};
        const metricsAndLabelsMap: Record<any, any> = {};

        items.forEach((item) => {
          const baseLabels = pick(item.baseInfo.labels, [
            "fileName",
            "filePath",
          ]);
          if (!item.analyzed.labels) {
            return;
          }
          Object.entries(item.analyzed.labels).forEach(
            ([labelKey, labelValue]) => {
              if (!countMap[labelKey]) {
                countMap[labelKey] = {};
              }
              const labelValueString = String(labelValue);
              if (!countMap[labelKey][labelValueString]) {
                countMap[labelKey][labelValueString] = 0;
              }
              countMap[labelKey][labelValueString]++;
            }
          );
        });

        Object.entries(metricsAndLabelsMap).forEach(([chartKey, data]) => {
          console.log(data);
        });

        Object.entries(countMap).forEach(([labelKey, countMetrics]) => {
          const chartKey = `Count of ${labelKey} - ${type}`;
          const sorted = Object.entries(countMetrics).sort(
            (a, b) => a[1] - b[1]
          );
          const sortedLabels = sorted.map((item) => item[0]);
          const sortedValues = sorted.map((item) => item[1]);
          const chart: GenericChartDefinition = {
            chartType: "line",
            labels: sortedLabels,
            values: sortedValues,
            key: chartKey,
          };
          charts.push(chart);
        });

        chartDataMap[type] = charts;
      });

      pluginResults.push({
        name: pluginResult.plugin.PluginClass.name,
        charts: chartDataMap,
      });
    });

    const dir = path.dirname(__filename);
    await fs.writeFile(
      `${dir}/../ui/src/assets/charts.json`,
      JSON.stringify(pluginResults)
    );
  }
}

// Object.entries(item.baseInfo.metrics).forEach(
//   ([metricKey, metricValue]) => {
//     const chartKey = `${metricKey} by ${labelKey}`;
//     if (!metricsAndLabelsMap[chartKey]) {
//       metricsAndLabelsMap[chartKey] = {
//         labels: [],
//         values: [],
//       };
//     }
//     metricsAndLabelsMap[chartKey].labels.push(labelValueString);
//     metricsAndLabelsMap[chartKey].values.push(metricValue);
//     console.log(chartKey);
//   }
// );

export default ChartJSPlugin;
