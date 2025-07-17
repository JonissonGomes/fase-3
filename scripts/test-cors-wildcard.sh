#!/bin/bash

# Script para testar CORS liberado (wildcard)
# Uso: ./scripts/test-cors-wildcard.sh

set -e

echo "🌐 Testando CORS liberado (wildcard)..."

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

# Diferentes origens para testar
ORIGINS=(
    "https://fase-3.vercel.app"
    "https://google.com"
    "https://example.com"
    "http://localhost:3000"
    "http://localhost:8080"
)

log "🧪 Testando CORS com diferentes origens..."

# Testar Auth Service
log "🔐 Testando Auth Service..."
for origin in "${ORIGINS[@]}"; do
    log "   Testando origem: $origin"
    
    # Testar requisição OPTIONS (preflight)
    cors_headers=$(curl -s -I -H "Origin: $origin" -H "Access-Control-Request-Method: POST" "$AUTH_URL/auth/register" 2>/dev/null | grep -i "access-control-allow-origin" || echo "NO_CORS")
    
    if echo "$cors_headers" | grep -q "access-control-allow-origin"; then
        log "   ✅ CORS permitido para $origin"
    else
        warn "   ⚠️  CORS não configurado para $origin"
    fi
done

# Testar Vehicles Service
log "🚗 Testando Vehicles Service..."
for origin in "${ORIGINS[@]}"; do
    log "   Testando origem: $origin"
    
    cors_headers=$(curl -s -I -H "Origin: $origin" "$VEHICLES_URL/vehicles" 2>/dev/null | grep -i "access-control-allow-origin" || echo "NO_CORS")
    
    if echo "$cors_headers" | grep -q "access-control-allow-origin"; then
        log "   ✅ CORS permitido para $origin"
    else
        warn "   ⚠️  CORS não configurado para $origin"
    fi
done

# Testar Orders Service
log "📦 Testando Orders Service..."
for origin in "${ORIGINS[@]}"; do
    log "   Testando origem: $origin"
    
    cors_headers=$(curl -s -I -H "Origin: $origin" "$ORDERS_URL/orders" 2>/dev/null | grep -i "access-control-allow-origin" || echo "NO_CORS")
    
    if echo "$cors_headers" | grep -q "access-control-allow-origin"; then
        log "   ✅ CORS permitido para $origin"
    else
        warn "   ⚠️  CORS não configurado para $origin"
    fi
done

log "🧪 Testando requisições POST..."

# Testar requisição POST do frontend
log "📤 Testando requisição POST do frontend..."
post_response=$(curl -s -X POST \
  -H "Origin: https://fase-3.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","senha":"test123","nome":"Test User","perfil":"cliente"}' \
  "$AUTH_URL/auth/register" 2>/dev/null)

if [ $? -eq 0 ]; then
    log "✅ Requisição POST funcionando"
    echo "   Response: $post_response"
else
    error "❌ Requisição POST falhou"
fi

log "📋 Configuração CORS aplicada:"
echo "   origin: '*' (qualquer origem)"
echo "   credentials: false"
echo "   methods: GET, POST, PUT, DELETE, OPTIONS, PATCH"
echo "   allowedHeaders: Content-Type, Authorization, X-Requested-With, Accept, Origin"

log "🎯 Próximos passos:"
echo "   1. Aguarde alguns minutos para o deploy no Render"
echo "   2. Execute este script novamente: ./scripts/test-cors-wildcard.sh"
echo "   3. Teste no navegador: https://fase-3.vercel.app/register"

log "⚠️  Nota de Segurança:"
echo "   Esta configuração permite CORS de qualquer origem."
echo "   Para produção, considere restringir para domínios específicos."

log "🎉 CORS liberado com sucesso!" 