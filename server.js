// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Пример маршрута для получения скрытых переменных
app.get('/api/secrets', (req, res) => {
  // Здесь будем использовать переменные из окружения
  const secretValue = process.env.TELEGRAM_BOT_TOKEN;
  res.json({ secret: secretValue });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
