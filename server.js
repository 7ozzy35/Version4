const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Kök yoluna gelen istekleri işleme
app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor!');
});

// JSON dosyasından veri okuyarak endpoint'te sunmak
app.get('/api/data', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Veri okunamadı.' });
    }
    res.json(JSON.parse(data));
  });
});

// Sunucuyu başlatma
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});
