import axios from "axios";
import AdmZip from "adm-zip";

export async function fetchRepoFromURL(repoPath: string) {
  const { name, user } = getGithubRepoDetailsFromURL(repoPath);
  const url = `https://api.github.com/repos/${user}/${name}/zipball`;
  const repo = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return new AdmZip(repo.data);
}

export function getGithubRepoDetailsFromURL(query: string) {
  const [user, name] = query.split("/").slice(-2);
  return {
    user,
    name,
  };
}

export const getZip = async (path: string) => {
  if (path.startsWith("https://github.com")) {
    return await fetchRepoFromURL(path);
  }
  const zip = new AdmZip();
  zip.addLocalFolder(path);
  return zip;
};
