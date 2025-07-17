#!/bin/bash

# Script para verificar status dos serviços no Render
# Uso: ./scripts/check-render-status.sh

set -e

echo "🔍 Verificando status dos serviços no Render..."

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

log "📡 Testando conectividade básica..."

# Testar se os domínios resolvem
log "🔍 Testando resolução DNS..."
for url in "$AUTH_URL" "$VEHICLES_URL" "$ORDERS_URL"; do
    domain=$(echo "$url" | sed 's|https://||')
    if nslookup "$domain" >/dev/null 2>&1; then
        log "✅ DNS resolvido para $domain"
    else
        error "❌ DNS não resolve para $domain"
    fi
done

log "🌐 Testando conectividade HTTP..."

# Testar conectividade HTTP
for url in "$AUTH_URL" "$VEHICLES_URL" "$ORDERS_URL"; do
    log "📡 Testando $url..."
    
    # Testar se o servidor responde
    if curl -s -o /dev/null -w "%{http_code}" "$url" >/dev/null 2>&1; then
        log "✅ Servidor responde em $url"
        
        # Verificar headers específicos
        headers=$(curl -s -I "$url" 2>/dev/null)
        
        if echo "$headers" | grep -q "x-render-routing: no-server"; then
            warn "⚠️  Render não está roteando para o serviço em $url"
        fi
        
        if echo "$headers" | grep -q "server: cloudflare"; then
            log "✅ Cloudflare ativo em $url"
        fi
        
    else
        error "❌ Servidor não responde em $url"
    fi
done

log "🧪 Testando rotas específicas..."

# Testar rotas específicas
log "🔐 Testando Auth Service..."
auth_response=$(curl -s -w "%{http_code}" "$AUTH_URL/auth/register" 2>/dev/null || echo "000")
if [ "$auth_response" = "404" ]; then
    warn "⚠️  Rota /auth/register retorna 404"
elif [ "$auth_response" = "000" ]; then
    error "❌ Não foi possível conectar ao Auth Service"
else
    log "✅ Auth Service responde com código $auth_response"
fi

log "🚗 Testando Vehicles Service..."
vehicles_response=$(curl -s -w "%{http_code}" "$VEHICLES_URL/vehicles" 2>/dev/null || echo "000")
if [ "$vehicles_response" = "404" ]; then
    warn "⚠️  Rota /vehicles retorna 404"
elif [ "$vehicles_response" = "000" ]; then
    error "❌ Não foi possível conectar ao Vehicles Service"
else
    log "✅ Vehicles Service responde com código $vehicles_response"
fi

log "📦 Testando Orders Service..."
orders_response=$(curl -s -w "%{http_code}" "$ORDERS_URL/orders" 2>/dev/null || echo "000")
if [ "$orders_response" = "404" ]; then
    warn "⚠️  Rota /orders retorna 404"
elif [ "$orders_response" = "000" ]; then
    error "❌ Não foi possível conectar ao Orders Service"
else
    log "✅ Orders Service responde com código $orders_response"
fi

log "📋 Resumo do diagnóstico:"
echo ""
echo "🔍 Possíveis causas do problema:"
echo "   1. Serviços não estão rodando no Render"
echo "   2. Deploy não foi bem-sucedido"
echo "   3. Configuração incorreta no Render"
echo "   4. Problema de roteamento do Render"
echo ""
echo "🛠️  Próximos passos:"
echo "   1. Acesse: https://dashboard.render.com"
echo "   2. Verifique o status dos serviços"
echo "   3. Verifique os logs de deploy"
echo "   4. Force um novo deploy se necessário"
echo ""
echo "📊 URLs para verificar:"
echo "   Auth: $AUTH_URL"
echo "   Vehicles: $VEHICLES_URL"
echo "   Orders: $ORDERS_URL" 