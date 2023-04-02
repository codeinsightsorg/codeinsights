import fs from "fs/promises";
import path from "path";
import { groupBy, isNil, pick, sum } from "lodash";
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
        const metricsAndLabelsMap: Record<
          string,
          {
            labels: string[];
            values: number[];
          }
        > = {};

        items.forEach((item) => {
          if (!item.analyzed.labels) {
            return;
          }
          Object.entries(item.analyzed.labels).forEach(
            ([labelKey, labelValue]) => {
              if (isNil(labelValue)) {
                return;
              }
              if (!countMap[labelKey]) {
                countMap[labelKey] = {};
              }
              const labelValueString = String(labelValue);
              if (!countMap[labelKey][labelValueString]) {
                countMap[labelKey][labelValueString] = 0;
              }
              countMap[labelKey][labelValueString]++;

              if (!item.analyzed.metrics) {
                return;
              }
              Object.entries(item.analyzed.metrics).forEach(
                ([metricKey, metricValue]) => {
                  if (isNil(metricValue)) {
                    return;
                  }
                  const chartKey = `${labelKey} by ${metricKey}`;
                  if (!metricsAndLabelsMap[chartKey]) {
                    metricsAndLabelsMap[chartKey] = {
                      labels: [],
                      values: [],
                    };
                  }
                  metricsAndLabelsMap[chartKey].labels.push(labelValueString);
                  metricsAndLabelsMap[chartKey].values.push(metricValue);
                }
              );
            }
          );
        });

        Object.entries(metricsAndLabelsMap).forEach(([chartKey, data]) => {
          const sorted = data.labels
            .map(
              (label, index) => [label, data.values[index]] as [string, number]
            )
            .sort((a, b) => a[1] - b[1])
            .map(([label, value]) => {
              return {
                label,
                value,
              };
            });
          const grouped = groupBy(sorted, (item) => item.label);
          console.log(data);
          const chart: GenericChartDefinition = {
            chartType: "line",
            labels: Object.keys(grouped),
            values: Object.values(grouped).map((metrics) => {
              return sum(metrics.map((metric) => metric.value));
            }),
            key: chartKey,
          };
          charts.push(chart);
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
