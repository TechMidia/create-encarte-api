const pool = require('../db');

async function verificarPlano(telefone) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM planos WHERE telefone = $1 AND ativo = true LIMIT 1',
      [telefone]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

module.exports = { verificarPlano };
