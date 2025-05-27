const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const uploadToS3 = require('./uploadS3');
const pool = require('./db');

// Carregando variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importação das rotas
const imagemRoute = require('./routes/imagem');
const planoRoute = require('./routes/plano'); // Verifique se o nome do arquivo é "plano.js" ou "planos.js"
const usuarioRoute = require('./routes/usuario');

// Registro das rotas
app.use('/api', imagemRoute);       // GET /api/imagem-produto
app.use('/api', usuarioRoute);      // POST /api/cadastrar-usuario
app.use('/api', planoRoute);        // GET /api/verificar-plano

// Rota de teste simples
app.get('/', (req, res) => {
  res.send('API do Encarte está rodando com sucesso!');
});

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

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
