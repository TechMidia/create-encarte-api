const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Pasta de destino
const seloDir = path.join(__dirname, '../public/selos3d');

// Garante que a pasta existe
if (!fs.existsSync(seloDir)) {
    fs.mkdirSync(seloDir, { recursive: true });
}

router.post('/', async (req, res) => {
    try {
        const { nome_mercado } = req.body;

        if (!nome_mercado) {
            return res.status(400).json({ error: 'nome_mercado é obrigatório' });
        }

        // Nome do arquivo com padrão
        const nomeArquivo = nome_mercado.toLowerCase().replace(/\s+/g, '_') + '_selo3d.png';
        const caminhoArquivo = path.join(seloDir, nomeArquivo);

        // Se já existe, retorna direto
        if (fs.existsSync(caminhoArquivo)) {
            const url = `/public/selos3d/${nomeArquivo}`;
            return res.json({ status: 'ok', url_selo_3d: url });
        }

        // Simula a chamada na Dezgo (aqui você depois pluga a chamada real)
        console.log(`🔍 Buscando selo 3D para mercado: ${nome_mercado}`);

        // Exemplo de chamada (você pode implementar de verdade com a API Dezgo):
        /*
        const response = await axios.post('https://api.dezgo.com/remove-background', {
            image: 'URL_DA_IMAGEM_DO_SELO',
            apiKey: process.env.API_KEY_DEZGO
        });
        */

        // Por enquanto, cria um arquivo "mock" para teste
        fs.writeFileSync(caminhoArquivo, ''); // Cria um arquivo vazio para teste

        const url = `/public/selos3d/${nomeArquivo}`;
        return res.json({ status: 'ok', url_selo_3d: url });
    } catch (error) {
        console.error('Erro em /buscar-selo-3d:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = router;
