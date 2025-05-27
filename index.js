require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const app = express();

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.post('/gerar-encarte', async (req, res) => {
  try {
    const { logo, selo, pessoa, rodape, produtos, fundo } = req.body;

    if (!logo || !selo || !pessoa || !rodape || !produtos || !fundo) {
      return res.status(400).json({ erro: 'Dados incompletos para gerar encarte.' });
    }

    const fundoPath = path.join(__dirname, 'public', 'imagens', fundo);
    let imagemBase = sharp(fundoPath);

    const elementos = [
      { input: path.join(__dirname, 'public', 'imagens', logo), top: 30, left: 850 },
      { input: path.join(__dirname, 'public', 'imagens', selo), top: 30, left: 50 },
      { input: path.join(__dirname, 'public', 'imagens', pessoa), top: 30, left: 450 },
      { input: path.join(__dirname, 'public', 'imagens', rodape), top: 1660, left: 0 }
    ];

    produtos.forEach((produto, index) => {
      elementos.push({
        input: path.join(__dirname, 'public', 'produtos', produto.imagem),
        top: produto.top,
        left: produto.left
      });
    });

    const composicao = await imagemBase
      .composite(elementos)
      .toFile(path.join(__dirname, 'public', 'resultado', 'encarte-final.png'));

    res.json({ mensagem: 'Encarte gerado com sucesso.', imagem: '/static/resultado/encarte-final.png' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar encarte.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API de encarte rodando na porta ${PORT}`);
});
