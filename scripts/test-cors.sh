#!/bin/bash

# Script para testar conectividade e CORS dos serviços
# Uso: ./scripts/test-cors.sh

set -e

echo "🧪 Testando conectividade e CORS dos serviços..."

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

# URLs dos serviços
AUTH_URL="https://fase-3-auth-service.onrender.com"
VEHICLES_URL="https://fase-3-vehicles-service.onrender.com"
ORDERS_URL="https://fase-3-orders-service.onrender.com"
FRONTEND_URL="https://fase-3.vercel.app"

log "🔍 Testando conectividade dos serviços..."

# Testar Auth Service
log "📡 Testando Auth Service..."
if curl -s -o /dev/null -w "%{http_code}" "$AUTH_URL/health" | grep -q "200"; then
    log "✅ Auth Service está respondendo"
else
    error "❌ Auth Service não está respondendo"
    warn "   URL: $AUTH_URL/health"
fi

# Testar Vehicles Service
log "📡 Testando Vehicles Service..."
if curl -s -o /dev/null -w "%{http_code}" "$VEHICLES_URL/health" | grep -q "200"; then
    log "✅ Vehicles Service está respondendo"
else
    error "❌ Vehicles Service não está respondendo"
    warn "   URL: $VEHICLES_URL/health"
fi

# Testar Orders Service
log "📡 Testando Orders Service..."
if curl -s -o /dev/null -w "%{http_code}" "$ORDERS_URL/health" | grep -q "200"; then
    log "✅ Orders Service está respondendo"
else
    error "❌ Orders Service não está respondendo"
    warn "   URL: $ORDERS_URL/health"
fi

log "🔍 Testando CORS..."

# Testar CORS no Auth Service
log "🌐 Testando CORS no Auth Service..."
CORS_RESPONSE=$(curl -s -I -H "Origin: $FRONTEND_URL" "$AUTH_URL/auth/register" 2>/dev/null | grep -i "access-control-allow-origin" || echo "NO_CORS_HEADER")

if echo "$CORS_RESPONSE" | grep -q "access-control-allow-origin"; then
    log "✅ CORS configurado no Auth Service"
    echo "   Headers: $CORS_RESPONSE"
else
    warn "⚠️  CORS não configurado ou bloqueado no Auth Service"
fi

# Testar requisição OPTIONS (preflight)
log "🛫 Testando requisição OPTIONS (preflight)..."
OPTIONS_RESPONSE=$(curl -s -X OPTIONS -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" "$AUTH_URL/auth/register" 2>/dev/null)

if [ $? -eq 0 ]; then
    log "✅ Requisição OPTIONS funcionando"
else
    warn "⚠️  Requisição OPTIONS falhou"
fi

log "🧪 Testando requisição POST simulada..."

# Simular requisição POST do frontend
log "📤 Simulando requisição POST do frontend..."
POST_RESPONSE=$(curl -s -X POST \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -H "Access-Control-Request-Method: POST" \
  -d '{"email":"test@test.com","senha":"test123","nome":"Test User","perfil":"cliente"}' \
  "$AUTH_URL/auth/register" 2>/dev/null)

if [ $? -eq 0 ]; then
    log "✅ Requisição POST funcionando"
    echo "   Response: $POST_RESPONSE"
else
    error "❌ Requisição POST falhou"
fi

log "📋 Resumo dos testes:"
echo "   Auth Service: $AUTH_URL"
echo "   Vehicles Service: $VEHICLES_URL"
echo "   Orders Service: $ORDERS_URL"
echo "   Frontend: $FRONTEND_URL"

log "🎯 Próximos passos:"
echo "   1. Aguarde alguns minutos para o deploy no Render"
echo "   2. Execute este script novamente: ./scripts/test-cors.sh"
echo "   3. Teste no navegador: $FRONTEND_URL/register"

log "📊 Para monitorar o deploy:"
echo "   - Dashboard Render: https://dashboard.render.com"
echo "   - Logs dos serviços no Render" 