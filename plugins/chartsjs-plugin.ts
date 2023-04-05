import fs from "fs/promises";
import path from "path";
import { groupBy, isNil, pick, sum } from "lodash";
import { BaseAnalyzerPlugin } from "../src/shared/models/plugin.model";
import {
  AnalyzedEntity,
  AnalyzeResults,
} from "../src/shared/models/analyze.model";

interface GenericChartDefinition {
  chartType: "line" | "bar" | "pie";
  key: string;
  labels: string[];
  values: number[];
}

interface ChartDataMap {
  [key: string]: {
    count: number;
    charts: GenericChartDefinition[];
  };
}

export class ChartJSPlugin implements BaseAnalyzerPlugin {
  async onAllFinishProcessing({ results }: AnalyzeResults) {
    const pluginResults: {
      name: string;
      charts: ChartDataMap;
    }[] = [];

    results.forEach((pluginResult) => {
      const chartDataMap: ChartDataMap = {};

      const groupedByType = groupBy(
        pluginResult.data,
        (item) => item.analyzed.type
      );

      Object.entries(groupedByType).forEach(([type, items]) => {
        const getBaseLabels = (item: AnalyzedEntity) =>
          pick(item.baseInfo.labels, ["fileName", "filePath"]);
        const getAnalyzedLabels = (item: AnalyzedEntity) =>
          item.analyzed.labels;
        const getAnalyzedMetrics = (item: AnalyzedEntity) =>
          item.analyzed.metrics;
        const analyzedCharts = getCharts(
          items,
          getAnalyzedLabels,
          getAnalyzedMetrics
        );
        const enrichedCharts = getCharts(
          items,
          getBaseLabels,
          getAnalyzedMetrics,
          true
        );
        chartDataMap[type] = {
          count: items.length,
          charts: [...analyzedCharts, ...enrichedCharts],
        };
      });

      pluginResults.push({
        name: pluginResult.plugin.PluginClass.name,
        charts: chartDataMap,
      });
    });

    return pluginResults;
  }
}

function getCharts(
  items: AnalyzedEntity[],
  getLabelsFn: any,
  getMetricsFn: any,
  skipCount = false
) {
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
    Object.entries(getLabelsFn(item)).forEach(([labelKey, labelValue]) => {
      const labelValueString = String(labelValue);
      if (!labelValueString) {
        return;
      }
      if (!countMap[labelKey]) {
        countMap[labelKey] = {};
      }
      if (!countMap[labelKey][labelValueString]) {
        countMap[labelKey][labelValueString] = 0;
      }
      countMap[labelKey][labelValueString]++;

      if (!getMetricsFn(item)) {
        return;
      }
      Object.entries(getMetricsFn(item)).forEach(([metricKey, metricValue]) => {
        if (isNil(metricValue) || typeof metricValue !== "number") {
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
      });
    });
  });

  if (!skipCount) {
    Object.entries(countMap).forEach(([labelKey, countMetrics]) => {
      const chartKey = `Count of ${labelKey}`;
      const sorted = Object.entries(countMetrics).sort((a, b) => a[1] - b[1]);
      const sortedLabels = sorted.map((item) => item[0]);
      const sortedValues = sorted.map((item) => item[1]);
      const chart: GenericChartDefinition = {
        chartType: "pie",
        labels: sortedLabels,
        values: sortedValues,
        key: chartKey,
      };
      charts.push(chart);
    });
  }

  Object.entries(metricsAndLabelsMap).forEach(([chartKey, data]) => {
    const mapped = data.labels.map((label, index) => {
      return {
        label,
        value: data.values[index],
      };
    });
    const grouped = groupBy(mapped, (item) => item.label);
    const sorted = Object.entries(grouped)
      .map(([label, values]) => {
        return {
          label,
          value: sum(values.map((metric) => metric.value)),
        };
      })
      .sort((a, b) => {
        return a.value - b.value;
      });
    const chart: GenericChartDefinition = {
      chartType: "bar",
      labels: sorted.map((item) => item.label),
      values: sorted.map((item) => item.value),
      key: chartKey,
    };
    charts.push(chart);
  });

  return charts;
}

export default ChartJSPlugin;
