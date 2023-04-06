import { create } from "zustand";
import { getNPMPackages } from "../../shared/npm-api";

interface Repo {
  type: "repo";
  url: string;
}

interface NPMPackage {
  type: "npm";
  name: string;
  description: string;
  npmURL: string;
  githubURL: string;
}

type SearchSuggestion = NPMPackage | Repo;

interface SuggestionsListStore {
  suggestions: SearchSuggestion[];
  getSuggestions: (query: string) => Promise<void>;
}
export const useSuggestionsListStore = create<SuggestionsListStore>((set) => ({
  suggestions: [],
  getSuggestions: async (query) => {
    if (!query) {
      set({ suggestions: [] });
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
