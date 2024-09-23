const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// JSON dosyasının yolu
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());

// Kullanıcı kaydı için endpoint
app.post('/register', (req, res) => {
  const { client, card } = req.body;

  // Verileri al
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Veri dosyasını okurken hata oluştu.' });
    }

    const jsonData = JSON.parse(data);

    // Yeni ID oluştur
    const newClientId = jsonData.clients.length + 1;
    const newCardId = jsonData.cards.length + 1;

    // Yeni verileri ekle
    client.ID = newClientId;
    card.ID = newCardId;

    jsonData.clients.push(client);
    jsonData.cards.push(card);

    // Güncellenmiş veriyi yaz
    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Veri dosyasını kaydederken hata oluştu.' });
      }

      res.status(200).json({ message: 'Kayıt başarılı!' });
    });
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor...`);
});
