#!/bin/bash

# Script para setup do Frontend React
# Plataforma de Revenda de Veículos

set -e

echo "🚀 Setup do Frontend React - Plataforma de Revenda de Veículos"
echo "================================================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js 16+ primeiro."
    echo "   Visite: https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js versão 16+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Navegar para o diretório frontend
cd frontend

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🔧 Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cat > .env << EOF
# URLs dos microserviços
VITE_AUTH_SERVICE_URL=https://fase-3-auth-service.onrender.com
VITE_VEHICLES_SERVICE_URL=https://fase-3-vehicles-service.onrender.com
VITE_ORDERS_SERVICE_URL=https://fase-3-orders-service.onrender.com
EOF
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "🧪 Testando build..."
npm run build

echo ""
echo "🎉 Setup do Frontend concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Para desenvolvimento: npm run dev"
echo "2. Para produção: npm run build"
echo "3. Para deploy na Vercel:"
echo "   - Conecte o repositório na Vercel"
echo "   - Configure o diretório: frontend/"
echo "   - Configure as variáveis de ambiente"
echo ""
echo "🌐 URLs dos microserviços configuradas:"
echo "   Auth: https://fase-3-auth-service.onrender.com"
echo "   Vehicles: https://fase-3-vehicles-service.onrender.com"
echo "   Orders: https://fase-3-orders-service.onrender.com"
echo ""
echo "📚 Documentação: frontend/README.md" 