// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Включение CORS
app.use(cors({
  origin: 'https://hayabuzo.github.io', // Разрешить запросы только с этого домена
}));

// Увеличение лимита размера запроса
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const TBT = process.env.TELEGRAM_BOT_TOKEN;
const CID = '-1002425906440'; // Замените на ваш chat_id

// Функция для отправки изображения в Telegram
async function sendToTelegram(imageDataUrl) {
  try {
    // Преобразование DataURL в Blob (на самом деле ArrayBuffer)
    const response = await axios.get(imageDataUrl, { responseType: 'arraybuffer' });

    const formData = new FormData();
    formData.append('chat_id', CID);
    formData.append('photo', Buffer.from(response.data), {
      filename: 'snapshot.png',
      contentType: 'image/png'
    });

    // Подпись с гиперссылкой
    const caption = '✉️ <a href="https://hayabuzo.github.io/upload.jpg/">отправить свой снимок</a> 📸';
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${TBT}/sendPhoto`,
      formData,
      {
        headers: formData.getHeaders()
      }
    );

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
