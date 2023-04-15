export function getGithubRepoDetailsFromURL(query: string) {
  const [user, name] = query.split("/").slice(-2);
  return {
    user,
    name
  };
}
