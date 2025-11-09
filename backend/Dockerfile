# Imagem base
FROM node:18

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Expor a porta
EXPOSE 5000

# Rodar o servidor
CMD ["npm", "start"]
