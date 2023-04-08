import { create } from "zustand";
import { getGithubRepos, getNPMPackages } from "../../shared/suggestion-api";
import { getGithubRepoNameFromURL } from "./utils";

interface Repo {
  type: "repo";
  url: string;
  name: string;
  description?: string;
}

interface NPMPackage {
  type: "npm";
  name: string;
  description: string;
  npmURL: string;
  githubURL: string;
}

export type SearchSuggestion = NPMPackage | Repo;

interface SuggestionsListStore {
  current: SearchSuggestion | null;
  suggestions: SearchSuggestion[];
  getSuggestions: (query: string) => Promise<void>;
  setCurrentSuggestion: (suggestions: SearchSuggestion) => void;
}
export const useSuggestionsListStore = create<SuggestionsListStore>((set) => ({
  suggestions: [],
  current: null,
  setCurrentSuggestion(suggestion: SearchSuggestion) {
    set({ current: suggestion });
  },
  getSuggestions: async (query) => {
    if (!query) {
      set({ suggestions: [] });
      return;
    }
    if (query.startsWith("https://github.com")) {
      const suggestion: Repo = {
        type: "repo",
        url: query,
        name: getGithubRepoNameFromURL(query),
      };
      set({ suggestions: [suggestion] });
      return;
    }
    const packages = await getNPMPackages(query);
    const mappedPackages: SearchSuggestion[] = packages.data.map((pack) => {
      return {
        type: "npm",
        name: pack.package.name,
        description: pack.package.description,
        npmURL: pack.package.links.npm,
        githubURL: pack.package.links.repository,
      };
    });
    set({ suggestions: mappedPackages });
  },
}));
