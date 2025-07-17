#!/bin/bash

# Script para fazer deploy dos serviços com correção de CORS
# Uso: ./scripts/deploy-cors-fix.sh

set -e

echo "🔧 Deploy dos serviços com correção de CORS..."

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

log "📋 Verificando alterações de CORS..."

# Verificar se os arquivos foram modificados
if ! grep -q "fase-3.vercel.app" services/auth-service/src/server.js; then
    error "Configuração de CORS não encontrada no auth-service"
    exit 1
fi

if ! grep -q "fase-3.vercel.app" services/vehicles-service/src/server.js; then
    error "Configuração de CORS não encontrada no vehicles-service"
    exit 1
fi

if ! grep -q "fase-3.vercel.app" services/orders-service/src/server.js; then
    error "Configuração de CORS não encontrada no orders-service"
    exit 1
fi

log "✅ Configuração de CORS verificada em todos os serviços"

# Fazer commit das alterações
log "📝 Fazendo commit das alterações..."

git add services/auth-service/src/server.js
git add services/vehicles-service/src/server.js
git add services/orders-service/src/server.js

git commit -m "fix: corrigir CORS para aceitar domínio da Vercel (fase-3.vercel.app)"

log "✅ Commit realizado"

# Fazer push para o repositório
log "🚀 Fazendo push para o repositório..."

git push origin main

log "✅ Push realizado"

log "🔄 Deploy automático iniciado no Render..."
log "⏳ Aguarde alguns minutos para os serviços serem atualizados"

log "📋 URLs dos serviços:"
echo "   Auth Service: https://fase-3-auth-service.onrender.com"
echo "   Vehicles Service: https://fase-3-vehicles-service.onrender.com"
echo "   Orders Service: https://fase-3-orders-service.onrender.com"

log "🌐 Frontend: https://fase-3.vercel.app"

log "🧪 Para testar após o deploy:"
echo "   1. Acesse: https://fase-3.vercel.app/register"
echo "   2. Tente fazer cadastro"
echo "   3. Verifique se não há mais erro de CORS"

log "📊 Para monitorar o deploy:"
echo "   - Acesse o dashboard do Render"
echo "   - Verifique os logs dos serviços"
echo "   - Teste os health checks:"
echo "     curl https://fase-3-auth-service.onrender.com/health"

log "🎉 Deploy iniciado com sucesso!" 