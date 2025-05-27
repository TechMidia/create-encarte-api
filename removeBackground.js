// services/removeBackground.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function removerFundoDezgo(imageUrl, nomeArquivo) {
  const response = await axios.post(
    'https://api.dezgo.com/remove-background',
    {
      image_url: imageUrl,
    },
    {
      headers: {
        'X-Api-Key': process.env.DEZGO_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    }
  );

  const filePath = path.join(__dirname, `../assets/${nomeArquivo}.png`);
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

module.exports = removerFundoDezgo;
