#!/bin/bash

# ========================================
# SCRIPT DE CONFIGURAÇÃO DO RENDER
# ========================================
# Revenda de Veículos - Deploy no Render
# Versão: 1.0.0

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se está no diretório correto
check_directory() {
    if [ ! -f "render.yaml" ]; then
        error "Arquivo render.yaml não encontrado. Execute este script na raiz do projeto."
        exit 1
    fi
    success "Diretório correto"
}

# Verificar se o git está configurado
check_git() {
    log "Verificando configuração do Git..."
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Este diretório não é um repositório Git"
        exit 1
    fi
    
    if [ -z "$(git remote -v)" ]; then
        warning "Nenhum remote configurado. Configure o GitHub primeiro:"
        echo "git remote add origin https://github.com/seu-usuario/revenda-veiculos.git"
        exit 1
    fi
    success "Git configurado"
}

# Verificar se o render.yaml existe
check_render_config() {
    log "Verificando configuração do Render..."
    if [ ! -f "render.yaml" ]; then
        error "Arquivo render.yaml não encontrado"
        exit 1
    fi
    success "Arquivo render.yaml encontrado"
}

# Verificar estrutura dos serviços
check_services() {
    log "Verificando estrutura dos serviços..."
    
    services=("auth-service" "vehicles-service" "orders-service")
    for service in "${services[@]}"; do
        if [ ! -d "services/$service" ]; then
            error "Serviço $service não encontrado em services/$service"
            exit 1
        fi
        
        if [ ! -f "services/$service/package.json" ]; then
            error "package.json não encontrado em services/$service"
            exit 1
        fi
    done
    success "Estrutura dos serviços OK"
}

# Verificar se há mudanças não commitadas
check_git_status() {
    log "Verificando status do Git..."
    if [ -n "$(git status --porcelain)" ]; then
        warning "Há mudanças não commitadas:"
        git status --short
        echo ""
        read -p "Deseja fazer commit das mudanças? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Prepare for Render deployment"
            success "Mudanças commitadas"
        else
            warning "Faça commit das mudanças antes de continuar"
            exit 1
        fi
    else
        success "Repositório limpo"
    fi
}

# Mostrar instruções de deploy
show_deploy_instructions() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  INSTRUÇÕES DE DEPLOY NO RENDER${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo -e "${GREEN}1. MongoDB Atlas:${NC}"
    echo "   - Crie uma conta em mongodb.com/atlas"
    echo "   - Crie um cluster gratuito"
    echo "   - Configure acesso de rede (0.0.0.0/0)"
    echo "   - Crie usuário de banco de dados"
    echo "   - Obtenha a string de conexão"
    echo ""
    
    echo -e "${GREEN}2. Render:${NC}"
    echo "   - Acesse dashboard.render.com"
    echo "   - Clique em 'New +' → 'Blueprint'"
    echo "   - Conecte seu repositório GitHub"
    echo "   - O Render detectará o render.yaml automaticamente"
    echo ""
    
    echo -e "${GREEN}3. Configurar Variáveis:${NC}"
    echo "   - JWT_SECRET: Será gerado automaticamente"
    echo "   - MONGODB_URI: Use a string do MongoDB Atlas"
    echo "   - FRONTEND_URL: URL do seu frontend (quando implementado)"
    echo ""
    
    echo -e "${GREEN}4. URLs dos Serviços:${NC}"
    echo "   - Auth: https://revenda-auth-service.onrender.com"
    echo "   - Vehicles: https://revenda-vehicles-service.onrender.com"
    echo "   - Orders: https://revenda-orders-service.onrender.com"
    echo ""
    
    echo -e "${GREEN}5. Testar Deploy:${NC}"
    echo "   curl https://revenda-auth-service.onrender.com/health"
    echo "   curl https://revenda-vehicles-service.onrender.com/health"
    echo "   curl https://revenda-orders-service.onrender.com/health"
    echo ""
}

# Verificar se o repositório está no GitHub
check_github() {
    log "Verificando se o repositório está no GitHub..."
    remote_url=$(git remote get-url origin)
    
    if [[ $remote_url == *"github.com"* ]]; then
        success "Repositório conectado ao GitHub"
        echo "URL: $remote_url"
    else
        warning "Repositório não está no GitHub"
        echo "URL atual: $remote_url"
        echo ""
        echo "Para conectar ao GitHub:"
        echo "1. Crie um repositório no GitHub"
        echo "2. Execute: git remote set-url origin https://github.com/seu-usuario/revenda-veiculos.git"
    fi
}

# Fazer push para o GitHub
push_to_github() {
    log "Fazendo push para o GitHub..."
    
    read -p "Deseja fazer push para o GitHub agora? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        success "Push realizado com sucesso"
    else
        warning "Faça push manualmente: git push origin main"
    fi
}

# Mostrar próximos passos
show_next_steps() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  PRÓXIMOS PASSOS${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo -e "${GREEN}1. MongoDB Atlas:${NC}"
    echo "   - Crie cluster e obtenha string de conexão"
    echo "   - Configure bancos: auth_service, vehicles_service, orders_service"
    echo ""
    
    echo -e "${GREEN}2. Render:${NC}"
    echo "   - Conecte repositório via Blueprint"
    echo "   - Configure variáveis de ambiente"
    echo "   - Aguarde deploy automático"
    echo ""
    
    echo -e "${GREEN}3. Testes:${NC}"
    echo "   - Teste health checks"
    echo "   - Teste login: admin@revenda.com / admin123"
    echo "   - Teste APIs com Postman"
    echo ""
    
    echo -e "${GREEN}4. Monitoramento:${NC}"
    echo "   - Configure alertas no Render"
    echo "   - Monitore logs e métricas"
    echo "   - Configure backup no MongoDB Atlas"
    echo ""
    
    echo -e "${YELLOW}📚 Documentação:${NC}"
    echo "   - docs/DEPLOY_RENDER.md"
    echo "   - docs/PREPARACAO_PUBLICACAO.md"
    echo "   - docs/POSTMAN_GUIDE.md"
}

# Função principal
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  CONFIGURAÇÃO PARA DEPLOY NO RENDER${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    check_directory
    check_git
    check_render_config
    check_services
    check_git_status
    check_github
    
    echo ""
    show_deploy_instructions
    
    push_to_github
    
    show_next_steps
}

# Executar função principal
main "$@" 