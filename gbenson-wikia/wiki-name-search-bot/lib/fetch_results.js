const fetch = require('node-fetch');

module.exports = async (callback, query, batchNumber = 1) => {
    let response;
    try {
        response = await fetch(`https://www.wikia.com/api/v1/Wikis/ByString?string=${encodeURIComponent(query)}&batch=${batchNumber}`);
    } catch (e) {
        return callback(null, {
            text: `An error occurred when fetching wiki names:${e.toString()}`
        });
    }

    let data;
    try {
        data = await response.json();
    } catch (e) {
        return callback(null, {
            text: `An error occurred while parsing the API response: ${e.toString()}`
        });
    }

    data.query = query;

    if (data.error) {
        return callback(null, {
            text: response.error
        });
    }

    const slackResponse = {};

    const links = data.items.map(
        item => item.domain
    ).join('\n');

    slackResponse.text = `Search results for "${query}":\n${links}`;

    const actions = [];

    if (data.currentBatch > 1) {
        actions.push({
            name: 'nextbatch',
            text: `Previous Page`,
            type: 'button',
            value: `${data.currentBatch - 1}|${data.query}`
        });
    }

    if (data.next !== 0 && data.currentBatch < data.batches) {
        actions.push({
                name: 'nextbatch',
                text: `Show ${data.next} More`,
                type: 'button',
                value: `${data.currentBatch + 1}|${data.query}`
            }
        );
    }

    if (actions.length > 0) {
        slackResponse.attachments = [
            {
                type: 'interactive_message',
                text: `Page ${data.currentBatch} of ${data.batches} (${data.total} results total)`,
                attachment_type: 'default',
                callback_id: `wikisearch_${data.query}_${data.currentBatch}`,
                actions
            }
        ];
    }

    return callback(null, slackResponse);
};