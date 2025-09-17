require("dotenv").config();
const express = require("express");
const { WebClient } = require("@slack/web-api");

const app = express();
app.use(express.json());

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const channelId = process.env.CHANNEL_ID;

// Send a message
app.post("/send", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await slackClient.chat.postMessage({
      channel: channelId,
      text,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.data || err.message });
  }
});

// Schedule a message
app.post("/schedule", async (req, res) => {
  try {
    const { text, delay } = req.body; // delay in seconds
    const result = await slackClient.chat.scheduleMessage({
      channel: channelId,
      text,
      post_at: Math.floor(Date.now() / 1000) + delay,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.data || err.message });
  }
});

// Retrieve messages
app.get("/history", async (req, res) => {
  try {
    const result = await slackClient.conversations.history({
      channel: channelId,
      limit: 10,
    });
    res.json(result.messages);
  } catch (err) {
    res.status(500).json({ error: err.data || err.message });
  }
});

// Edit a message
app.put("/edit", async (req, res) => {
  try {
    const { ts, text } = req.body; // ts = timestamp of message
    const result = await slackClient.chat.update({
      channel: channelId,
      ts,
      text,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.data || err.message });
  }
});

// Delete a message
app.delete("/delete", async (req, res) => {
  try {
    const { ts } = req.body; // ts = timestamp of message
    const result = await slackClient.chat.delete({
      channel: channelId,
      ts,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
