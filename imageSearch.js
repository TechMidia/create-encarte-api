// services/imageSearch.js
const axios = require('axios');

async function buscarImagemGoogle(produto) {
  const apiKey = process.env.SERPAPI_KEY;
  const query = encodeURIComponent(produto);

  const url = `https://serpapi.com/search.json?q=${query}&tbm=isch&api_key=${apiKey}`;
  const response = await axios.get(url);
  const imagem = response.data.images_results?.[0]?.original || null;

  return imagem;
}

module.exports = buscarImagemGoogle;
