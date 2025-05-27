require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('API Encarte ativa');
});

// Rota de geração do encarte
app.post('/gerar-encarte', async (req, res) => {
  try {
    const { fundo, logo, selo3d, pessoa, rodape, produtos } = req.body;

    if (!fundo || !logo || !selo3d || !pessoa || !rodape || !produtos) {
      return res.status(400).json({ erro: 'Faltam dados para gerar o encarte' });
    }

    const base = await sharp(Buffer.from(fundo, 'base64'))
      .composite([
        { input: Buffer.from(logo, 'base64'), top: 20, left: 780 },
        { input: Buffer.from(selo3d, 'base64'), top: 20, left: 20 },
        { input: Buffer.from(pessoa, 'base64'), top: 20, left: 380 },
        { input: Buffer.from(rodape, 'base64'), top: 1600, left: 0 }
      ])
      .png()
      .toBuffer();

    const nomeArquivo = `encarte-${Date.now()}.png`;
    const caminho = path.join(__dirname, 'encartes', nomeArquivo);

    fs.mkdirSync(path.dirname(caminho), { recursive: true });
    fs.writeFileSync(caminho, base);

    res.json({
      mensagem: 'Encarte gerado com sucesso!',
      caminho: `/encartes/${nomeArquivo}`
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao gerar o encarte', detalhe: erro.message });
  }
});

app.use('/encartes', express.static(path.join(__dirname, 'encartes')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});
