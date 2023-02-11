import fs from "fs/promises";
import {analyzeFile} from "./analyzer";
import {config} from "../config/config";
import {AnalyzedItem} from "./types";
import {typescriptFilePlugin} from "../../plugins/file.plugin";
import {getAST} from "./utils";

export async function readAllFiles() {
    const plugin = typescriptFilePlugin;
    let allResults: AnalyzedItem[] = [];
    await _recursiveAnalyzeAllFiles(config.repoPath!);
    plugin.done(allResults);
    return allResults;

    async function _recursiveAnalyzeAllFiles(rootPath: string) {
        const filesNames = await fs.readdir(rootPath)

        for (const fileName of filesNames) {
            const filePath = `${rootPath}/${fileName}`;
            const fileKey = filePath.replace(`${config.repoPath}/`, '');
            if (config.ignoreFolders && config.ignoreFolders.includes(fileKey)) {
                continue;
            }
            const lStat = await fs.lstat(filePath);
            if (lStat.isDirectory()) {
                await _recursiveAnalyzeAllFiles(filePath);
                continue;
            }
            const fileString = (await fs.readFile(filePath)).toString('utf-8');
            if (!plugin.fileExtensions.some(ext => fileKey.endsWith(ext))) {
                continue;
            }
            const ast = getAST(fileString, plugin.parser);
            const analyzeResult = plugin.analyze({
                ast,
                fileString
            })
            if (analyzeResult.length) {
                allResults = allResults.concat(analyzeResult)
            }
        }
    }
}
