import { create } from "zustand";
import axios from "axios";
import { PluginResult } from "../../../plugins/chartsjs-plugin";
import { AnalyzeResults } from "../../../src/shared/models/analyze.model";
interface AnalyzeResultState {
  charts: PluginResult[];
  isLoading: boolean;
  getAnalyzeResults: (query: string) => Promise<void>;
}
export const useAnalyzeResultsStore = create<AnalyzeResultState>((set) => ({
  charts: null,
  isLoading: false,
  getAnalyzeResults: async (url) => {
    set({ isLoading: true });
    const response = await axios.get<AnalyzeResults>(`/api/data`, {
      params: {
        url: `${url}`.replace(/\.git$/, ""),
      },
    });
    const chartData = response.data.results
      .find((item) => item.plugin.plugin.name === "ChartJSPlugin")
      .allPluginsData.filter((response) => {
        return !!Object.keys(response.charts).length;
      });
    set({ charts: chartData, isLoading: false });
  },
}));
