import { AnalyzerPlugin } from "../models/plugin.model";
import { AnalyzeResults } from "../models/analyze.model";
import axios from "axios";

interface CoralogixProcessorConfig {
  privateKey: string;
  clusterURL?: string;
  applicationName?: string;
  subsystemName?: string;
}

export class CoralogixPlugin
  implements AnalyzerPlugin<CoralogixProcessorConfig>
{
  async onAllFinishProcessing(
    items: AnalyzeResults,
    config: CoralogixProcessorConfig | undefined
  ) {
    if (!config) {
      return;
    }
    const url = config.clusterURL ?? "https://api.coralogix.com/api/v1/logs";
    console.log("Sending logs to Coralogix");
    try {
      const result = (
        await axios.post(url, {
          privateKey: process.env.CGX_PRIVATE_KEY,
          applicationName: config.applicationName ?? "code-analyzer",
          subsystemName: config.subsystemName ?? "code-analyzer",
          logEntries: items,
        })
      ).data;
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }
}

export default CoralogixPlugin;
