const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/cadastrar-usuario', async (req, res) => {
  const { telefone, nome_mercado, endereco, instagram, logomarca } = req.body;

  if (!telefone || !nome_mercado || !endereco) {
    return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
  }

  try {
    const client = await pool.connect();
    await client.query(
      `INSERT INTO usuario (telefone, nome_mercado, endereco, instagram, logomarca, assinatura, plano, encarte_semana, encarte_total) 
       VALUES ($1, $2, $3, $4, $5, true, 'plano 1', 0, 0) 
       ON CONFLICT (telefone) DO NOTHING`,
      [telefone, nome_mercado, endereco, instagram, logomarca]
    );
    client.release();

    res.json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

module.exports = router;
