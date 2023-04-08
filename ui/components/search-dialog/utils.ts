export function getGithubRepoNameFromURL(query: string) {
  const [user, name] = query.split("/").slice(-2);
  return name;
}
