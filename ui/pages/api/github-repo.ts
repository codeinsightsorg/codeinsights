import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.query) {
    res.status(400).json({ error: "Missing query parameter" });
    return;
  }
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const results = await octokit.request("GET /search/repositories", {
    q: req.query.query as string,
  });
  res.status(200).json(results.data);
}
