import { ChartConfiguration } from "chart.js";
import fs from "fs/promises";
import path from "path";
import { groupBy } from "lodash";
import { BasePlugin } from "../src/plugins/analyze-plugin";
import { BaseAnalyzerPlugin } from "../src/shared/models/plugin.model";
import {
  AnalyzedEntity,
  AnalyzeResults,
} from "../src/shared/models/analyze.model";

interface ChartDataMap {
  [key: string]: Record<
    string,
    { labels: any[]; data: number[]; type?: string }
  >;
}

type ChartDefinition = Record<string, ChartConfiguration[]>;

export class ChartJSPlugin implements BaseAnalyzerPlugin {
  async onAllFinishProcessing({ results }: AnalyzeResults, plugin: BasePlugin) {
    const pluginResults: { name: string; charts: ChartDefinition }[] = [];

    results.forEach((pluginResult) => {
      const chartDataMap: ChartDataMap = {};
      const groupedByType = groupBy(
        pluginResult.result,
        (item) => item.result.type
      );

      Object.entries(groupedByType).forEach(([type, items]) => {
        if (!chartDataMap[type]) {
          chartDataMap[type] = {};
        }

        items.forEach((item) => {
          const baseLabels = {
            path: item.baseInformation.file.path,
            name: item.baseInformation.file.name,
          };
          const mergedLabels = {
            ...(item.result.labels || {}),
            ...baseLabels,
          };
          Object.entries(mergedLabels).forEach(([labelKey, labelValue]) => {
            if (!labelValue || typeof labelValue !== "string") {
              return;
            }
            Object.entries(item.result.metrics || {}).forEach(
              ([metricKey, metricValue]) => {
                const chartKey = `${labelKey}_${metricKey}`;
                if (!chartDataMap[type][chartKey]) {
                  chartDataMap[type][chartKey] = { labels: [], data: [] };
                }
                chartDataMap[type][chartKey].labels.push(labelValue);
                chartDataMap[type][chartKey].data.push(metricValue!);
              }
            );
          });
        });

        const labelsCount = countUniqueValues(items);
        Object.entries(labelsCount).forEach(([key, countMetrics]: any) => {
          const sorted = Object.entries(countMetrics)
            .sort(([, countA]: any, [, countB]: any) => countA - countB)
            .map(([label, value]) => {
              return {
                label,
                value,
              };
            });
          const sortedLabels = sorted.map((item) => item.label);
          const sortedValues = sorted.map((item) => item.value) as any;
          const chartKey = `Count - ${key}`;
          if (!chartDataMap[type][chartKey]) {
            chartDataMap[type][chartKey] = { labels: [], data: [] };
          }
          chartDataMap[type][chartKey].data = sortedValues;
          chartDataMap[type][chartKey].labels = sortedLabels;
        });
      });

      const chartDefinitions = getChartsDefinition(chartDataMap);

      pluginResults.push({
        name: pluginResult.plugin.PluginClass.name,
        charts: chartDefinitions,
      });
    });

    const dir = path.dirname(__filename);
    await fs.writeFile(
      `${dir}/src/assets/charts.json`,
      JSON.stringify(pluginResults)
    );
  }
}

function buildChart(
  labels: string[],
  dataSets: ChartConfiguration["data"]["datasets"],
  type: ChartConfiguration["type"] = "line"
) {
  const chartDefinition: ChartConfiguration = {
    type,
    data: {
      labels: labels.slice(-20),
      datasets: dataSets.map((set) => {
        return {
          ...set,
          data: set.data.slice(-20),
        };
      }),
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  return chartDefinition;
}

function getChartsDefinition(chartDataMap: ChartDataMap) {
  const allCharts: ChartDefinition = {};
  Object.entries(chartDataMap).forEach(([type, dataMap]) => {
    const chartDefinitions: ChartConfiguration[] = [];

    Object.entries(dataMap).forEach(([chartKey, chartData]) => {
      const sortedData = chartData.labels
        .map((label, index) => ({
          label,
          value: chartData.data[index],
        }))
        .sort((a, b) => a.value - b.value);

      const sortedLabels = sortedData.map((item) => item.label);
      const sortedValues = sortedData.map((item) => item.value);

      const chartDefinition = buildChart(sortedLabels, [
        {
          label: chartKey,
          data: sortedValues,
          fill: true,
          backgroundColor: "rgba(72,72,176,0.2)",
          borderColor: "#d048b6",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#d048b6",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#d048b6",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
        },
      ]);
      chartDefinitions.push(chartDefinition);
    });
    allCharts[type] = chartDefinitions;
  });
  return allCharts;
}

function countUniqueValues(array: AnalyzedEntity[]) {
  const counts = {};

  array.forEach((item) => {
    const baseLabels = {
      path: item.baseInformation.file.path,
      name: item.baseInformation.file.name,
    };
    const mergedLabels = {
      ...(item.result.labels || {}),
      ...baseLabels,
    };
    Object.keys(mergedLabels).forEach((key) => {
      const value = mergedLabels[key];
      if (counts[key]) {
        if (!counts[key][value]) {
          counts[key][value] = 1;
        } else {
          counts[key][value]++;
        }
      } else {
        counts[key] = {};
        counts[key][value] = 1;
      }
    });
  });

  return counts;
}
export default ChartJSPlugin;
