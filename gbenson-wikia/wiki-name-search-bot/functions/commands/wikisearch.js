const fetchResults = require('../../lib/fetch_results.js');
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
    return fetchResults(callback, text);
};
