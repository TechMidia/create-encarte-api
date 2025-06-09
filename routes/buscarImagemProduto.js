const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Pasta de destino
const produtoDir = path.join(__dirname, '../public/produtos');

// Garante que a pasta existe
if (!fs.existsSync(produtoDir)) {
    fs.mkdirSync(produtoDir, { recursive: true });
}

router.post('/', async (req, res) => {
    try {
        const { nome_produto } = req.body;

        if (!nome_produto) {
            return res.status(400).json({ error: 'nome_produto é obrigatório' });
        }

        // Nome do arquivo com padrão
        const nomeArquivo = nome_produto.toLowerCase().replace(/\s+/g, '_') + '_produto.png';
        const caminhoArquivo = path.join(produtoDir, nomeArquivo);

        // Se já existe, retorna direto
        if (fs.existsSync(caminhoArquivo)) {
            const url = `/public/produtos/${nomeArquivo}`;
            return res.json({ status: 'ok', url_imagem_produto: url });
        }

        // Simula a chamada na Dezgo (depois você pluga a real)
        console.log(`🔍 Buscando imagem para produto: ${nome_produto}`);

        // Exemplo de chamada real (para implementar):
        /*
        const response = await axios.post('https://api.dezgo.com/remove-background', {
            image: 'URL_DA_IMAGEM_DO_PRODUTO',
            apiKey: process.env.API_KEY_DEZGO
        });
        */

        // Por enquanto, cria um arquivo "mock" para teste
        fs.writeFileSync(caminhoArquivo, ''); // Cria um arquivo vazio para teste

        const url = `/public/produtos/${nomeArquivo}`;
        return res.json({ status: 'ok', url_imagem_produto: url });
    } catch (error) {
        console.error('Erro em /buscar-imagem-produto:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = router;
