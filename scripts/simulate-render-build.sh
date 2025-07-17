#!/bin/bash

# Script para simular o processo de build do Render
# Uso: ./scripts/simulate-render-build.sh

set -e

echo "🔨 Simulando processo de build do Render..."

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

# Criar diretório temporário para simular o ambiente do Render
TEMP_DIR="/tmp/render-simulation"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

log "📁 Criando ambiente de simulação em $TEMP_DIR"

# Copiar projeto para diretório temporário
cp -r . "$TEMP_DIR/"
cd "$TEMP_DIR"

log "🔧 Simulando build do Auth Service..."

# Simular build do auth-service
cd services/auth-service

# Verificar se o package.json tem as dependências corretas
if ! grep -q '"express"' package.json; then
    error "❌ Express não encontrado no package.json do auth-service"
fi

# Simular npm install
log "📦 Executando npm install..."
if npm install >/dev/null 2>&1; then
    log "✅ npm install bem-sucedido"
else
    error "❌ npm install falhou"
    exit 1
fi

# Verificar se o server.js pode ser executado
log "🚀 Testando execução do server.js..."
if node -c src/server.js >/dev/null 2>&1; then
    log "✅ server.js é válido"
else
    error "❌ server.js tem erros de sintaxe"
    exit 1
fi

# Simular start do serviço (por alguns segundos)
log "🔄 Iniciando serviço por 5 segundos..."
timeout 5s npm start >/dev/null 2>&1 &
SERVER_PID=$!

# Aguardar um pouco para o serviço inicializar
sleep 2

# Testar se o serviço está respondendo
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    log "✅ Serviço está respondendo em localhost:3001"
else
    warn "⚠️  Serviço não está respondendo em localhost:3001"
fi

# Parar o serviço
kill $SERVER_PID 2>/dev/null || true

cd ../..

log "🔧 Simulando build do Vehicles Service..."

# Simular build do vehicles-service
cd services/vehicles-service

# Simular npm install
log "📦 Executando npm install..."
if npm install >/dev/null 2>&1; then
    log "✅ npm install bem-sucedido"
else
    error "❌ npm install falhou"
    exit 1
fi

# Verificar se o server.js pode ser executado
log "🚀 Testando execução do server.js..."
if node -c src/server.js >/dev/null 2>&1; then
    log "✅ server.js é válido"
else
    error "❌ server.js tem erros de sintaxe"
    exit 1
fi

cd ../..

log "🔧 Simulando build do Orders Service..."

# Simular build do orders-service
cd services/orders-service

# Simular npm install
log "📦 Executando npm install..."
if npm install >/dev/null 2>&1; then
    log "✅ npm install bem-sucedido"
else
    error "❌ npm install falhou"
    exit 1
fi

# Verificar se o server.js pode ser executado
log "🚀 Testando execução do server.js..."
if node -c src/server.js >/dev/null 2>&1; then
    log "✅ server.js é válido"
else
    error "❌ server.js tem erros de sintaxe"
    exit 1
fi

cd ../..

log "📊 Resumo da simulação:"
echo ""
echo "✅ Todos os builds locais funcionaram"
echo "✅ Todos os server.js são válidos"
echo "✅ npm install funcionou em todos os serviços"
echo ""
echo "🔍 Possíveis problemas no Render:"
echo "   1. Render não está usando o render.yaml"
echo "   2. Variáveis de ambiente não configuradas"
echo "   3. Problema de permissões no Render"
echo "   4. Configuração incorreta no dashboard"
echo ""
echo "🛠️  Soluções:"
echo "   1. Acesse: https://dashboard.render.com"
echo "   2. Verifique se os serviços estão configurados corretamente"
echo "   3. Configure as variáveis de ambiente manualmente"
echo "   4. Force um novo deploy"

# Limpar diretório temporário
cd /
rm -rf "$TEMP_DIR"

log "🧹 Ambiente de simulação limpo"
log "🎉 Simulação concluída com sucesso!" 