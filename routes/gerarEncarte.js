const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Pasta de destino
const encarteDir = path.join(__dirname, '../public/encartes');

// Garante que a pasta existe
if (!fs.existsSync(encarteDir)) {
    fs.mkdirSync(encarteDir, { recursive: true });
}

router.post('/', async (req, res) => {
    try {
        const {
            tipo_encarte,
            background_url,
            logo_url,
            selo_3d_url,
            pessoa_com_produto_url,
            rodape,
            validade,
            produtos
        } = req.body;

        // Valida campos obrigatórios
        if (!background_url || !logo_url || !selo_3d_url || !produtos || produtos.length === 0) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        console.log(`🖼️ Gerando encarte...`);

        // Nome do arquivo gerado
        const nomeArquivo = `encarte_${Date.now()}.png`;
        const caminhoArquivo = path.join(encarteDir, nomeArquivo);

        // Cria a imagem base (por enquanto um background simples) — Exemplo de uso de Sharp:
        const width = tipo_encarte === 'feed' ? 1080 : 1080;
        const height = tipo_encarte === 'feed' ? 1080 : 1920;

        // Carrega background
        const background = await sharp(path.join(__dirname, `../${background_url}`))
            .resize(width, height)
            .toBuffer();

        let imagem = sharp(background).composite([]);

        // Exemplo de composição — você pode ajustar as posições:
        const elementos = [];

        // Adiciona selo 3D
        elementos.push({
            input: path.join(__dirname, `../${selo_3d_url}`),
            top: 20,
            left: 20
        });

        // Adiciona logo
        elementos.push({
            input: path.join(__dirname, `../${logo_url}`),
            top: 20,
            left: width - 220 // ajusta conforme a largura da logo
        });

        // Adiciona pessoa (se tiver)
        if (pessoa_com_produto_url) {
            elementos.push({
                input: path.join(__dirname, `../${pessoa_com_produto_url}`),
                top: 150,
                left: width / 2 - 150
            });
        }

        // Aqui você poderia adicionar também a renderização dos produtos com textos, usando SVG+Sharp

        // Adiciona todos os elementos
        imagem = imagem.composite(elementos);

        // Salva a imagem final
        await imagem.toFile(caminhoArquivo);

        const url = `/public/encartes/${nomeArquivo}`;
        console.log(`✅ Encarte gerado: ${url}`);

        return res.json({ status: 'ok', url_encarte_final: url });
    } catch (error) {
        console.error('Erro em /gerar-encarte:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = router;
