import axios from "axios";

export function getNPMPackages(query: string) {
  return axios.get(`https://api.npms.io/v2/search/suggestions?q=${query}`);
}

export function getGithubRepos(query: string) {
  return axios.get(`/api/github-repo`, {
    params: {
      query,
    },
  });
}
