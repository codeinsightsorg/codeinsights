import type { NextApiRequest, NextApiResponse } from "next";
import { init } from "@codeinsights/js";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.url) {
    res.status(400).json({ error: "Missing url parameter" });
    return;
  }
  const result = await init({
    repoPath: req.query.url as string,
  });
  res.status(200).json(result);
}
