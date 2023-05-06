const { google } = require("googleapis");

/**
 * Add a label to a message and move it to the label folder
 * @param {Object} auth - The authentication credentials
 * @param {Object} message - The message to be labeled
 * @param {string} labelId - The ID of the label to add to the message
 * @returns {Promise<void>}
 */

const addLabel = async (auth, message, labelId) =>{
  const gmail = google.gmail({ version: "v1", auth });
  const { id } = message;
  const requestBody = {
    addLabelIds: [labelId],
    removeLabelIds: ["INBOX"],
  };
  await gmail.users.messages.modify({ userId: "me", id, requestBody });
}

module.exports = addLabel;
