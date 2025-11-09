# Etapa 1: usar imagem Node.js
FROM node:18

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos do backend
COPY backend/package*.json ./
RUN npm install

COPY backend .

# Expor porta (Render usa variáveis de ambiente)
EXPOSE 10000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
