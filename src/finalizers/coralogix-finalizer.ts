import axios from "axios";

interface CoralogixProcessorConfig {
  privateKey: string;
  clusterURL?: string;
  applicationName?: string;
  subsystemName?: string;
}

export function coralogixFinalizer(config: CoralogixProcessorConfig) {
  const url = config.clusterURL ?? "https://api.coralogix.com/api/v1/logs";
  return async (finalResult: any) => {
    console.log("Sending logs to Coralogix");
    const result = (
      await axios.post(url, {
        privateKey: config.privateKey,
        applicationName: config.applicationName ?? "code-analyzer",
        subsystemName: config.subsystemName ?? "code-analyzer",
        logEntries: finalResult,
      })
    ).data;
    console.log(result);
  };
}
