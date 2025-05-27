const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const uploadToS3 = require('./uploadS3');
const imagemRoute = require('./routes/imagem');
const pool = require('./db'); // Certifique-se de que esse arquivo existe e exporta a conexão PostgreSQL
const planoRoute = require('./routes/plano');
app.use('/plano', planoRoute);
const usuarioRoute = require('./routes/usuario');
app.use('/api', usuarioRoute);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Encarte está rodando com sucesso!');
});

// Rota para buscar imagem de produto
app.use('/api', imagemRoute);

// Rota para criar encarte
app.post('/criar-encarte', async (req, res) => {
  const imagePath = path.join(__dirname, 'encarte.png');

  try {
    const imageUrl = await uploadToS3(imagePath, `encarte-${Date.now()}.png`);

    const client = await pool.connect();
    await client.query(
      'INSERT INTO encartes (telefone, imagem_url, data_criacao) VALUES ($1, $2, NOW())',
      [req.body.telefone, imageUrl]
    );
    client.release();

    res.json({ mensagem: 'Encarte criado com sucesso', url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar encarte', detalhe: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
