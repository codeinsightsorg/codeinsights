import { create } from "zustand";
import { getNPMPackages } from "../../shared/suggestion-api";

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
  current: {
    type: "repo",
    url: "https://github.com/yaircohendev/codeinsightsjs",
    name: "codeinsightsjs",
    description: null,
  },
  setCurrentSuggestion(suggestion: SearchSuggestion) {
    set({ current: suggestion });
  },
  getSuggestions: async (query) => {
    if (!query) {
      set({ suggestions: [] });
      return;
    }
    if (query.startsWith("https://github.com")) {
      const [user, name] = query.split("/").slice(-2);
      const suggestion: Repo = {
        type: "repo",
        url: query,
        name: name,
      };
      set({ suggestions: [suggestion] });
      return;
    }
    const packages = await getNPMPackages(query);
    const mappedPackages: NPMPackage[] = packages.data.map((pack) => {
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
