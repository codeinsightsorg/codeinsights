import { create } from "zustand";
import { AnalyzeResults } from "../../../src/shared/models/analyze.model";
import axios from "axios";

interface AnalyzeResultState {
  results: AnalyzeResults | null;
  isLoading: boolean;
  getAnalyzeResults: (query: string) => Promise<void>;
}
export const useAnalyzeResultsStore = create<AnalyzeResultState>((set) => ({
  results: null,
  isLoading: false,
  getAnalyzeResults: async (url) => {
    set({ isLoading: true });
    const response = await axios.get(`/api/data`, {
      params: {
        url: `${url}.git`,
      },
    });
    set({ results: response.data, isLoading: false });
  },
}));
