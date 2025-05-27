const express = require('express');
const router = express.Router();
const { verificarPlano } = require('../controllers/planoController');

router.get('/verificar-plano', async (req, res) => {
  const telefone = req.query.telefone;

  if (!telefone) {
    return res.status(400).json({ erro: 'Telefone é obrigatório' });
  }

  try {
    const plano = await verificarPlano(telefone);
    if (plano) {
      res.json({ ativo: true, plano });
    } else {
      res.json({ ativo: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao verificar plano' });
  }
});

module.exports = router;
