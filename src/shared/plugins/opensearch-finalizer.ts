import { BaseAnalyzerPlugin } from "../models/plugin.model";
import { AnalyzeResults } from "../models/analyze.model";
import { Client } from "@opensearch-project/opensearch";
import { v4 as uuidv4 } from "uuid";
import { BasePlugin } from "../../plugins/analyze-plugin";

interface ElasticOptions {
  indexPattern?: string;
}

export class OpensearchFinalizer implements BaseAnalyzerPlugin {
  async onAllFinishProcessing(items: AnalyzeResults, plugin: BasePlugin) {
    const params = (plugin.options.params || {}) as ElasticOptions;
    const runId = uuidv4();
    const timestamp = new Date().toISOString();
    const allLogs = items
      .flatMap((item) => item.result)
      .map((item) => {
        return {
          timestamp,
          runId,
          ...item,
        };
      });
    const client = new Client({ node: "http://localhost:9200" });
    console.log("Sending logs to Elastic");
    try {
      const mappedItems = allLogs.flatMap((doc) => [
        { index: { _index: params.indexPattern || "analyzer_index" } },
        doc,
      ]);
      const result = await client.bulk({
        body: mappedItems,
      });
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }
}

export default OpensearchFinalizer;
