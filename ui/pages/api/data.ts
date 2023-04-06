import type { NextApiRequest, NextApiResponse } from "next";
import { init } from "@codeinsights/js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await init({
    repoPath: "https://github.com/yaircohendev/codeinsightsjs.git",
    useCachedRepo: true,
  });
  res.status(200).json(result);
}
