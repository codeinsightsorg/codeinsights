import {readAllFiles} from "./file-traversal";

export async function initAnalyzer() {
 const allFiles = await readAllFiles();
 console.log(allFiles);
}
