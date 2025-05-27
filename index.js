import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('API de criação de encarte ativa!');
});

// Rota principal para criação de encarte
app.post('/criar-encarte', async (req, res) => {
  const { produtos, rodape, logoUrl, seloUrl, pessoaUrl, formato } = req.body;

  // Por enquanto, só retorna os dados recebidos
  res.json({
    mensagem: 'Recebido com sucesso!',
    dados: {
      produtos,
      rodape,
      logoUrl,
      seloUrl,
      pessoaUrl,
      formato
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
