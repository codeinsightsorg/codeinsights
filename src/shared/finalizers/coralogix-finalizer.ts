import axios from "axios";

interface CoralogixProcessorConfig {
  privateKey: string;
  clusterURL?: string;
  applicationName?: string;
  subsystemName?: string;
}

export default async function coralogixFinalizer(
  finalResult: any,
  config: CoralogixProcessorConfig
) {
  const url = config.clusterURL ?? "https://api.coralogix.com/api/v1/logs";
  console.log("Sending logs to Coralogix");
  try {
    const result = (
      await axios.post(url, {
        privateKey: config.privateKey,
        applicationName: config.applicationName ?? "code-analyzer",
        subsystemName: config.subsystemName ?? "code-analyzer",
        logEntries: finalResult,
      })
    ).data;
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
