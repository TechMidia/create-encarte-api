const pool = require('../db');

const cadastrarUsuario = async ({ telefone, nome_mercado, endereco, instagram, logomarca }) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO usuario (telefone, nome_mercado, endereco, instagram, logomarca, assinatura, plano, encarte_semana, encarte_total) VALUES ($1, $2, $3, $4, $5, true, $6, 0, 0)',
      [telefone, nome_mercado, endereco, instagram, logomarca, 'plano 1']
    );
    return { mensagem: 'Usuário cadastrado com sucesso' };
  } finally {
    client.release();
  }
};

module.exports = { cadastrarUsuario };
