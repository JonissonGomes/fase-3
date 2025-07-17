#!/bin/bash

# Script de deploy para Vercel
# Uso: ./scripts/deploy-vercel.sh

set -e  # Para o script se houver erro

echo "🚀 Iniciando deploy para Vercel..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf frontend/dist
rm -rf frontend/node_modules

# Instalar dependências
echo "📦 Instalando dependências..."
cd frontend
npm install

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Erro: Diretório dist não foi criado"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Voltar para a raiz
cd ..

# Deploy para Vercel
echo "🚀 Fazendo deploy para Vercel..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 Seu projeto está disponível em: https://fase-3-frontend.vercel.app" 