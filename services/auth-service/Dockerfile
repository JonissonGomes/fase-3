FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 3001

# Comando para executar o serviço
CMD ["npm", "start"] 