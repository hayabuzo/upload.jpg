require('dotenv').config();

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const CHAT_ID = process.env.CHAT_ID;

require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.get('/api/env', (req, res) => {
  res.json({
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    CHAT_ID: process.env.CHAT_ID
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
