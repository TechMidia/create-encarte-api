// controllers/planoController.js
const pool = require('../db');

async function verificarPlano(telefone) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT plano FROM usuarios WHERE telefone = $1 AND ativo = true LIMIT 1',
      [telefone]
    );

    if (result.rows.length > 0) {
      return result.rows[0].plano; // retorna o nome do plano (1, 2 ou 3)
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao consultar plano:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  verificarPlano,
};
