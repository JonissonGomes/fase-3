#!/bin/bash

# 🚀 Script de Deploy na Vercel
# Deploy automático do frontend na Vercel

set -e

echo "🚀 Iniciando deploy do frontend na Vercel..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}"
}

# Verificar se estamos no diretório raiz
if [ ! -f "vercel.json" ]; then
    error "Execute este script na raiz do projeto (onde está o vercel.json)"
    exit 1
fi

# Verificar se o frontend existe
if [ ! -d "frontend" ]; then
    error "Diretório frontend não encontrado"
    exit 1
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    warn "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado na Vercel
if ! vercel whoami &> /dev/null; then
    warn "Não está logado na Vercel. Faça login:"
    vercel login
fi

log "📋 Verificando configurações..."

# Verificar se o vercel.json existe
if [ ! -f "vercel.json" ]; then
    error "vercel.json não encontrado na raiz do projeto"
    exit 1
fi

# Verificar se o .vercelignore existe
if [ ! -f ".vercelignore" ]; then
    warn ".vercelignore não encontrado. Criando..."
    cat > .vercelignore << EOF
# Ignorar tudo exceto o frontend
services/
docs/
scripts/
tests/
infrastructure/
*.md
Makefile
docker-compose*.yml
env.*
.git/
node_modules/
EOF
fi

log "🔧 Verificando dependências do frontend..."

# Verificar se o package.json do frontend existe
if [ ! -f "frontend/package.json" ]; then
    error "package.json não encontrado no frontend"
    exit 1
fi

# Verificar se o vite.config.js existe
if [ ! -f "frontend/vite.config.js" ]; then
    error "vite.config.js não encontrado no frontend"
    exit 1
fi

log "📦 Instalando dependências do frontend..."

# Instalar dependências do frontend
cd frontend
npm install
cd ..

log "🏗️  Fazendo build do frontend..."

# Fazer build do frontend
cd frontend
npm run build
cd ..

# Verificar se o build foi bem-sucedido
if [ ! -d "frontend/dist" ]; then
    error "Build falhou. Diretório dist não encontrado"
    exit 1
fi

log "✅ Build concluído com sucesso!"

# Perguntar se quer fazer deploy
echo ""
read -p "🤔 Deseja fazer deploy na Vercel agora? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "🚀 Iniciando deploy na Vercel..."
    
    # Fazer deploy
    if vercel --prod; then
        log "✅ Deploy concluído com sucesso!"
        log "🌐 URL de produção disponível no dashboard da Vercel"
    else
        error "❌ Deploy falhou"
        exit 1
    fi
else
    info "📋 Para fazer deploy manualmente, execute:"
    echo "   vercel --prod"
fi

log "🎉 Processo concluído!"

echo ""
echo "📚 Próximos passos:"
echo "   1. Acesse o dashboard da Vercel"
echo "   2. Configure domínio personalizado (opcional)"
echo "   3. Configure variáveis de ambiente se necessário"
echo "   4. Monitore os logs de build"
echo ""
echo "🔗 Links úteis:"
echo "   - Dashboard Vercel: https://vercel.com/dashboard"
echo "   - Documentação: https://vercel.com/docs"
echo "   - Guia do Frontend: docs/FRONTEND_GUIDE.md" 