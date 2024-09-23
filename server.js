// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Включение CORS
app.use(cors({
  origin: 'https://hayabuzo.github.io', // Разрешить запросы только с этого домена
}));

// Пример маршрута для получения скрытых переменных
app.get('/api/secrets', (req, res) => {
  // Здесь будем использовать переменные из окружения
  const secretValue = process.env.TELEGRAM_BOT_TOKEN;
  if (!secretValue) {
    return res.status(500).json({ error: 'Secret value is not set' });
  }
  res.json({ secret: secretValue });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
