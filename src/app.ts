import {initAnalyzer} from "./modules/static-analyzer/controller";

async function init() {
    await initAnalyzer();
}

init().then();
