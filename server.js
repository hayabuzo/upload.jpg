// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const port = process.env.PORT || 3000;

// Включение CORS
app.use(cors({
  origin: 'https://hayabuzo.github.io', // Разрешить запросы только с этого домена
}));

app.use(express.json()); // Для парсинга JSON тела запроса

const TBT = process.env.TELEGRAM_BOT_TOKEN;
const CID = '-1002425906440'; // Замените на ваш chat_id

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

    console.log('Telegram API response:', telegramResponse.data);

    if (telegramResponse.status === 200) {
      console.log('Image sent successfully');
    } else {
      console.error('Failed to send image');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Маршрут для обработки запросов от фронтенда
app.post('/api/send-image', async (req, res) => {
  try {
    if (!TBT) {
      return res.status(500).send('Telegram Bot Token is not set');
    }
    await sendToTelegram(req.body.image);
    res.status(200).send('Image sent successfully');
  } catch (error) {
    console.error('Error sending image:', error);
    res.status(500).send('Error sending image');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
