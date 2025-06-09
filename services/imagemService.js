const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const gerarEncarte = async ({
    tipo_encarte,
    background_url,
    logo_url,
    selo_3d_url,
    pessoa_com_produto_url,
    rodape,
    validade,
    produtos
}) => {
    try {
        console.log('🖼️ Iniciando geração do encarte...');

        // Define dimensões
        const width = tipo_encarte === 'feed' ? 1080 : 1080;
        const height = tipo_encarte === 'feed' ? 1080 : 1920;

        // Carrega background
        const background = await sharp(path.join(__dirname, `../${background_url}`))
            .resize(width, height)
            .toBuffer();

        let imagem = sharp(background).composite([]);

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
            left: width - 220
        });

        // Adiciona pessoa (se tiver)
        if (pessoa_com_produto_url) {
            elementos.push({
                input: path.join(__dirname, `../${pessoa_com_produto_url}`),
                top: 150,
                left: width / 2 - 150
            });
        }

        // ⚠️ Aqui você pode evoluir: adicionar produtos + textos com SVG + Sharp (faremos depois!)

        // Composição
        imagem = imagem.composite(elementos);

        // Define nome do arquivo
        const nomeArquivo = `encarte_${Date.now()}.png`;
        const caminhoArquivo = path.join(__dirname, '../public/encartes', nomeArquivo);

        // Salva a imagem
        await imagem.toFile(caminhoArquivo);

        console.log(`✅ Encarte gerado: ${nomeArquivo}`);

        // Retorna o caminho para a API
        return `/public/encartes/${nomeArquivo}`;
    } catch (error) {
        console.error('Erro em gerarEncarte:', error);
        throw error;
    }
};

module.exports = { gerarEncarte };
