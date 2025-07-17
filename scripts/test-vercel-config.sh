#!/bin/bash

# Script para testar configuração do Vercel
# Uso: ./scripts/test-vercel-config.sh

set -e

echo "🧪 Testando configuração do Vercel..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

log "📋 Verificando arquivos de configuração..."

# Verificar vercel.json
if [ ! -f "vercel.json" ]; then
    error "vercel.json não encontrado"
    exit 1
fi

# Verificar se tem seção functions (que causa erro)
if grep -q '"functions"' vercel.json; then
    error "vercel.json contém seção 'functions' que causa erro em projetos SPA"
    warn "Remova a seção 'functions' do vercel.json"
    exit 1
fi

log "✅ vercel.json está correto"

# Verificar .vercelignore
if [ ! -f ".vercelignore" ]; then
    warn ".vercelignore não encontrado"
else
    log "✅ .vercelignore encontrado"
fi

# Verificar frontend
if [ ! -d "frontend" ]; then
    error "Diretório frontend não encontrado"
    exit 1
fi

log "✅ Diretório frontend encontrado"

# Verificar package.json do frontend
if [ ! -f "frontend/package.json" ]; then
    error "package.json não encontrado no frontend"
    exit 1
fi

log "✅ package.json do frontend encontrado"

# Verificar vite.config.js
if [ ! -f "frontend/vite.config.js" ]; then
    error "vite.config.js não encontrado no frontend"
    exit 1
fi

log "✅ vite.config.js encontrado"

# Verificar .nvmrc
if [ ! -f "frontend/.nvmrc" ]; then
    warn ".nvmrc não encontrado no frontend"
else
    log "✅ .nvmrc encontrado"
fi

# Verificar engines no package.json
if ! grep -q '"engines"' frontend/package.json; then
    warn "Campo 'engines' não encontrado no package.json do frontend"
else
    log "✅ Campo 'engines' encontrado"
fi

log "🔨 Testando build local..."

# Limpar build anterior
rm -rf frontend/dist frontend/node_modules

# Instalar dependências
cd frontend
npm install

# Fazer build
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    error "Build falhou. Diretório dist não encontrado"
    exit 1
fi

log "✅ Build local bem-sucedido"

# Verificar arquivos gerados
if [ ! -f "dist/index.html" ]; then
    error "index.html não encontrado no build"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    error "Diretório assets não encontrado no build"
    exit 1
fi

log "✅ Arquivos de build verificados"

# Voltar para a raiz
cd ..

log "🎉 Configuração do Vercel está correta!"
log "📋 Próximos passos:"
echo "   1. Faça commit das alterações"
echo "   2. Push para o repositório"
echo "   3. O deploy na Vercel será automático"
echo ""
echo "🔗 Ou execute deploy manual:"
echo "   make vercel-deploy" 