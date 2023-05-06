const { google } = require("googleapis");

const LABEL_NAME = {
  NAME: "Vacation Reply",
  ID: "me",
  LABEL_VISIBILITY: "labelShow",
  MESSAGE_VISIBILITY: "show",
};

/**
 * Creates a label in Gmail
 * @param {Object} auth - The authentication credentials
 * @returns {Promise<string>} - The ID of the created label
 */

const createLabel = async(auth) => {
  const gmail = google.gmail({ version: "v1", auth });

  const actions = {
    create: async () => {
      const res = await gmail.users.labels.create({
        userId: LABEL_NAME.ID,
        requestBody: {
          name: LABEL_NAME.NAME,
          labelListVisibility: LABEL_NAME.LABEL_VISIBILITY,
          messageListVisibility: LABEL_NAME.MESSAGE_VISIBILITY,
        },
      });

      return res.data.id;
    },
    find: async () => {
      const res = await gmail.users.labels.list({ userId: LABEL_NAME.ID });
      const label = res.data.labels.find((label) => label.name === LABEL_NAME.NAME);

      return label.id;
    },
  };

  try {
    return await actions.create();
  } catch (err) {
    if (err.code === 409) {
      // If Label already exists
      return await actions.find();
    } else {
      throw err;
    }
  }
}

module.exports = createLabel;
