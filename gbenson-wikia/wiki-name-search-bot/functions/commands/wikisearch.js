const fetch = require('node-fetch');
const lib = require('lib')({ token: process.env.STDLIB_TOKEN });
/**
 * /wikisearch
 *
 *   Searches for wikis with partial name response
 *
 * @param {string} user The user id of the user that invoked this command (name is usable as well)
 * @param {string} channel The channel id the command was executed in (name is usable as well)
 * @param {string} text The text contents of the command
 * @param {object} command The full Slack command object
 * @param {string} botToken The bot token for the Slack bot you have activated
 * @returns {object}
 */
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
    async function makeRequest() {
        let response;
        try {
            response = await fetch(`https://www.wikia.com/api/v1/Wikis/ByString?string=${encodeURIComponent(text)}`);
        } catch (e) {
            return `An error occurred when fetching wiki names:${e.toString()}`;
        }

        let data;
        try {
            data = await response.json();
        } catch (e) {
            return `An error occurred while parsing the API response: ${e.toString()}`;
        }

        const links = data.items.map(
            item => item.domain
        ).join('\n');

        return `Search results for "${text}":\n${links}`;
    }

    makeRequest()
        .then(
            (response) =>
                callback(null, {
                    text: response
                })
        );
};
