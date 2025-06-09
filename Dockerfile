# Usa imagem oficial do Node.js 20
FROM node:20

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --production

# Copia todo o restante do projeto
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "start"]
