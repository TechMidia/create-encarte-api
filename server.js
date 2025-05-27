const uploadToS3 = require('./uploadS3');
const path = require('path');
const imagemRoute = require('./routes/imagem');

app.post('/criar-encarte', async (req, res) => {
  // Lógica para gerar encarte e salvar como `encarte.png`
  const imagePath = path.join(__dirname, 'encarte.png');
  
  try {
    const imageUrl = await uploadToS3(imagePath, `encarte-${Date.now()}.png`);

    // Salvar no banco
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
