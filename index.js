const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

// Carrega variáveis de ambiente
dotenv.config();

// Middleware para receber JSON
app.use(express.json());

// Serve arquivos estáticos (as imagens geradas ficam em /public)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Importa e usa as rotas
app.use('/buscar-selo-3d', require('./routes/buscarSelo3d'));
app.use('/buscar-imagem-produto', require('./routes/buscarImagemProduto'));
app.use('/gerar-encarte', require('./routes/gerarEncarte'));

// Rota raiz para teste
app.get('/', (req, res) => {
    res.send('API Create Encarte - Online 🚀');
});

// Sobe o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
