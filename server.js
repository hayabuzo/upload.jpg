// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Включение CORS
app.use(cors({
  origin: 'https://hayabuzo.github.io', // Разрешить запросы только с этого домена
}));

const upload = multer({ dest: 'uploads/' });

const TBT = process.env.TELEGRAM_BOT_TOKEN;
const CID = '-1002425906440'; // Замените на ваш chat_id

// Функция для отправки изображения в Telegram
async function sendToTelegram(filePath) {
  try {
    const formData = new FormData();
    formData.append('chat_id', CID);
    formData.append('photo', fs.createReadStream(filePath));

    const telegramResponse = await axios.post(`https://api.telegram.org/bot${TBT}/sendPhoto`, formData, {
      headers: {
        ...formData.getHeaders()
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
app.post('/api/send-image', upload.single('image'), async (req, res) => {
  try {
    if (!TBT) {
      return res.status(500).send('Telegram Bot Token is not set');
    }
    const filePath = path.join(__dirname, req.file.path);
    await sendToTelegram(filePath);
    fs.unlinkSync(filePath); // Удалить временный файл после отправки
    res.status(200).send('Image sent successfully');
  } catch (error) {
    console.error('Error sending image:', error);
    res.status(500).send('Error sending image');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
