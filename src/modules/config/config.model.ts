import z from "zod";

export const ConfigSchema = z.object({
    repoPath: z.string().default('./').optional(),
    ignoreFolders: z.array(z.string()).optional(),
})

export type Config = z.infer<typeof ConfigSchema>;


