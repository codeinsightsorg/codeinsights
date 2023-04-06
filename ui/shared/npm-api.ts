import axios from "axios";

export function getNPMPackages(query: string) {
  return axios(`https://api.npms.io/v2/search/suggestions?q=${query}`);
}
