const { google } = require("googleapis");

/**
 * Send a reply to a message
 * @param {google.auth} auth An authorized OAuth2 client
 * @param {object} message The message to reply to
 * @returns {Promise<void>}
 */

const sendReply = async(auth, message) => {
  const gmail = google.gmail({ version: "v1", auth });

  const { data: { payload: { headers } } } = await gmail.users.messages.get({
    userId: "me",
    id: message.id,
    format: "metadata",
    metadataHeaders: ["Subject", "From"],
  });

  const subjectHeader = headers.find(header => header.name === "Subject");
  const fromHeader = headers.find(header => header.name === "From");

  const replyTo = fromHeader.value.match(/<(.*)>/)[1];
  const replySubject = subjectHeader.value.startsWith("Re:") ? subjectHeader.value : `Re: ${subjectHeader.value}`;
  const replyBody = `Hi,\n\nThank you for your email.\n\nI wanted to let you know that I am currently out of the office on vacation and will not be available now. I will respond to your email as soon as possible upon my return.\n\nRegards,\nJakcin`;

  const rawMessage = [
    `From: me`,
    `To: ${replyTo}`,
    `Subject: ${replySubject}`,
    `In-Reply-To: ${message.id}`,
    `References: ${message.id}`,
    "",
    replyBody,
  ].join("\n");

  const encodedMessage = Buffer.from(rawMessage).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

module.exports = sendReply;
