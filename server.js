// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Включение CORS
app.use(cors({
  origin: 'https://hayabuzo.github.io', // Разрешить запросы только с этого домена
}));

const upload = multer();

let TBT;
const CID = '-1002425906440'; // Замените на ваш chat_id

// Функция для получения переменных окружения
async function fetchEnvVariables() {
  try {
    const response = await axios.get('https://upload-jpg.vercel.app/api/tbt');
    const data = response.data;
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      TBT = data.tbt;
    }
  } catch (error) {
    console.error('Error fetching:', error);
  }
}

// Функция для отправки изображения в Telegram
async function sendToTelegram(imageDataUrl) {
  try {
    // Преобразование DataURL в Blob
    const response = await axios.get(imageDataUrl, { responseType: 'arraybuffer' });
    const blob = new Blob([response.data], { type: 'image/png' });
    const formData = new FormData();
    formData.append('chat_id', CID);
    formData.append('photo', blob, 'snapshot.png');

    const telegramResponse = await axios.post(`https://api.telegram.org/bot${TBT}/sendPhoto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (telegramResponse.status === 200) {
      console.log('Image sent successfully');
    } else {
      console.error('Failed to send image');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Пример маршрута для получения скрытых переменных
app.get('/api/tbt', (req, res) => {
  // Здесь будем использовать переменные из окружения
  const TBT = process.env.TELEGRAM_BOT_TOKEN;
  if (!TBT) {
    return res.status(500).json({ error: 'TBT value is not set' });
  }
  res.json({ tbt: TBT });
});

// Маршрут для обработки запросов от фронтенда
app.post('/api/send-image', upload.single('image'), async (req, res) => {
  try {
    await fetchEnvVariables();
    await sendToTelegram(req.file.buffer.toString('base64'));
    res.status(200).send('Image sent successfully');
  } catch (error) {
    res.status(500).send('Error sending image');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
