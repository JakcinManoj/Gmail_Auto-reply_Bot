const { google } = require("googleapis");

/**
 * Retrieves a list of unreplied messages from Gmail
 * @param {Object} auth - The authentication credentials
 * @returns {Promise<Array<Object>>} - The list of unreplied messages
 */

const getUnrepliedMessages = async(auth) => {
  const gmail = google.gmail({ version: "v1", auth });
  const { data } = await gmail.users.messages.list({
    userId: "me",
    q: "-in:chats -from:me -has:userlabels",
  });

  return data.messages || [];
}

module.exports = getUnrepliedMessages;
