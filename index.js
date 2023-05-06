/**
 * @fileoverview This file contains the main code for the Gmail API demo.
  * It creates a label for the app, and then it periodically checks for
  * messages that have no prior replies. For each such message, it sends
  * a reply and adds a label to the message.
 */

const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const getUnrepliedMessages = require("./services/getUnreadMessages");
const createLabel = require("./services/createLabel");
const sendReply = require("./services/sentReply");
const addLabel = require("./services/addLabel");
require('dotenv').config()

const port = parseInt(process.env.PORT);


// Add error handling middleware to the Express app
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Define the root route
app.get("/", async (req, res, next) => {
  try {
    // Load credentials from file
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, "credentials.json"),
      scopes: process.env.SCOPES.split(","),
    });

    // Initialize the Gmail API client
    const gmail = google.gmail({ version: "v1", auth });

    // List the user's labels
    const response = await gmail.users.labels.list({
      userId: "me",
    });
    const labels = response.data.labels;

    // Main function
    const main = async () => {
      // Create a label for the app
      const labelId = await createLabel(auth);
      console.log(`Created or found label with id ${labelId}`);

      // Repeat the following steps in random intervals
      setInterval(async () => {
        // Get messages that have no prior replies
        const messages = await getUnrepliedMessages(auth);
        console.log(`Found ${messages.length} unreplied messages`);

        // For each message
        for (const message of messages) {
          // Send reply to the message
          await sendReply(auth, message);

          // Add label to the message and move it to the label folder
          await addLabel(auth, message, labelId);
        }
      }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000); // Random interval between 45 and 120 seconds
    };

    // Call the main function
    await main();

    // Send a success response
    res.send("Success!");
  } catch (err) {
    // Pass the error to the error handling middleware
    next(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
