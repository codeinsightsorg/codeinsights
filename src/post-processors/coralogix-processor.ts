import axios from "axios";

interface CoralogixProcessorConfig {
    privateKey: string;
    clusterURL?: string;
}

export function coralogixProcessor(config: CoralogixProcessorConfig) {
    const url = config.clusterURL ?? 'https://api.coralogix.com/api/v1/logs'
    return async (finalResult: any) => {
        console.log('Sending logs to Coralogix');
        const result = (await axios.post(url, {
            privateKey: config.privateKey,
            applicationName: 'web-app',
            subsystemName: 'analyze',
            logEntries: finalResult
        })).data;
        console.log(result);
    }
}
