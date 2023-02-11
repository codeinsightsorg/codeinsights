import axios from "axios";

const url = 'https://api.coralogix.com/api/v1/logs'

export async function sendLogs(allLogs: any[] | []) {
    if (!allLogs.length) {
        return;
    }
    const result = (await axios.post(url, {
        privateKey: process.env.CGX_PRIVATE_KEY,
        applicationName: 'web-app',
        subsystemName: 'analyze',
        logEntries: allLogs.map(data => {
            return {
                timestamp: Date.now(),
                severity: 1,
                text: data
            }
        })
    })).data;
}
