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
app.get('/api/tbt', (req, res) => {
  // Здесь будем использовать переменные из окружения
  const TBT = process.env.TELEGRAM_BOT_TOKEN;
  if (!TBT) {
    return res.status(500).json({ error: 'TBT value is not set' });
  }
  res.json({ tbt: TBT });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
