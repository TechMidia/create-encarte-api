const express = require('express');
const router = express.Router();
const { cadastrarUsuario } = require('../controllers/usuarioController');

router.post('/cadastrar-usuario', async (req, res) => {
  try {
    const resultado = await cadastrarUsuario(req.body);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhe: err.message });
  }
});

module.exports = router;
