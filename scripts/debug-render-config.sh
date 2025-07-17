#!/bin/bash

# Script para debugar configuração do Render
# Uso: ./scripts/debug-render-config.sh

set -e

echo "🔍 Debugando configuração do Render..."

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

log "📋 Verificando estrutura do projeto..."

# Verificar se os diretórios dos serviços existem
for service in auth-service vehicles-service orders-service; do
    if [ -d "services/$service" ]; then
        log "✅ Diretório services/$service existe"
        
        # Verificar package.json
        if [ -f "services/$service/package.json" ]; then
            log "✅ package.json existe em services/$service"
            
            # Verificar scripts
            if grep -q '"start"' "services/$service/package.json"; then
                log "✅ Script 'start' existe em services/$service"
            else
                error "❌ Script 'start' não existe em services/$service"
            fi
        else
            error "❌ package.json não existe em services/$service"
        fi
        
        # Verificar server.js
        if [ -f "services/$service/src/server.js" ]; then
            log "✅ server.js existe em services/$service"
        else
            error "❌ server.js não existe em services/$service"
        fi
    else
        error "❌ Diretório services/$service não existe"
    fi
done

log "📋 Verificando arquivos de configuração..."

# Verificar render.yaml
if [ -f "render.yaml" ]; then
    log "✅ render.yaml existe"
    
    # Verificar se os serviços estão definidos
    if grep -q "fase-3-auth-service" render.yaml; then
        log "✅ Auth service definido no render.yaml"
    else
        error "❌ Auth service não definido no render.yaml"
    fi
    
    if grep -q "fase-3-vehicles-service" render.yaml; then
        log "✅ Vehicles service definido no render.yaml"
    else
        error "❌ Vehicles service não definido no render.yaml"
    fi
    
    if grep -q "fase-3-orders-service" render.yaml; then
        log "✅ Orders service definido no render.yaml"
    else
        error "❌ Orders service não definido no render.yaml"
    fi
else
    error "❌ render.yaml não existe"
fi

log "🧪 Testando build local dos serviços..."

# Testar build local do auth-service
log "🔨 Testando build do auth-service..."
cd services/auth-service
if npm install >/dev/null 2>&1; then
    log "✅ npm install funcionou no auth-service"
else
    error "❌ npm install falhou no auth-service"
fi
cd ../..

# Testar build local do vehicles-service
log "🔨 Testando build do vehicles-service..."
cd services/vehicles-service
if npm install >/dev/null 2>&1; then
    log "✅ npm install funcionou no vehicles-service"
else
    error "❌ npm install falhou no vehicles-service"
fi
cd ../..

# Testar build local do orders-service
log "🔨 Testando build do orders-service..."
cd services/orders-service
if npm install >/dev/null 2>&1; then
    log "✅ npm install funcionou no orders-service"
else
    error "❌ npm install falhou no orders-service"
fi
cd ../..

log "📊 Resumo do diagnóstico:"
echo ""
echo "🔍 Possíveis problemas identificados:"
echo "   1. Render não está reconhecendo a estrutura de monorepo"
echo "   2. Configuração incorreta no render.yaml"
echo "   3. Variáveis de ambiente não configuradas"
echo "   4. Problema de permissões ou build"
echo ""
echo "🛠️  Soluções recomendadas:"
echo "   1. Verificar se o Render está usando o render.yaml"
echo "   2. Configurar serviços manualmente no dashboard"
echo "   3. Verificar logs de build no Render"
echo "   4. Configurar variáveis de ambiente manualmente"
echo ""
echo "📋 URLs dos serviços:"
echo "   Auth: https://fase-3-auth-service.onrender.com"
echo "   Vehicles: https://fase-3-vehicles-service.onrender.com"
echo "   Orders: https://fase-3-orders-service.onrender.com"
echo ""
echo "🌐 Frontend: https://fase-3.vercel.app" 