#!/bin/bash

# ========================================
# SCRIPT DE DEPLOY PARA PRODUÇÃO
# ========================================
# Revenda de Veículos - MVP
# Versão: 1.0.0

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar se Docker está rodando
check_docker() {
    log "Verificando Docker..."
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Inicie o Docker e tente novamente."
        exit 1
    fi
    success "Docker está rodando"
}

# Verificar se docker-compose está disponível
check_docker_compose() {
    log "Verificando Docker Compose..."
    if ! command -v docker-compose > /dev/null 2>&1; then
        error "Docker Compose não está instalado."
        exit 1
    fi
    success "Docker Compose está disponível"
}

# Verificar arquivo de ambiente
check_env_file() {
    log "Verificando arquivo de ambiente..."
    if [ ! -f ".env.prod" ]; then
        warning "Arquivo .env.prod não encontrado"
        if [ -f "env.prod.example" ]; then
            log "Copiando env.prod.example para .env.prod..."
            cp env.prod.example .env.prod
            warning "Configure as variáveis de ambiente em .env.prod antes de continuar"
            exit 1
        else
            error "Arquivo env.prod.example não encontrado"
            exit 1
        fi
    fi
    success "Arquivo .env.prod encontrado"
}

# Backup do banco de dados
backup_database() {
    log "Fazendo backup do banco de dados..."
    if [ -d "backups" ]; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_dir="backups/backup_$timestamp"
        mkdir -p "$backup_dir"
        
        if docker-compose -f docker-compose.prod.yml ps | grep -q "mongodb"; then
            docker-compose -f docker-compose.prod.yml exec -T mongodb mongodump --out /backup
            docker-compose -f docker-compose.prod.yml cp mongodb:/backup "$backup_dir"
            success "Backup salvo em $backup_dir"
        else
            warning "MongoDB não está rodando, pulando backup"
        fi
    else
        warning "Diretório backups não existe, pulando backup"
    fi
}

# Parar serviços existentes
stop_services() {
    log "Parando serviços existentes..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    success "Serviços parados"
}

# Limpar imagens antigas
cleanup_images() {
    log "Limpando imagens antigas..."
    docker image prune -f
    success "Imagens antigas removidas"
}

# Build das imagens
build_images() {
    log "Construindo imagens..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    success "Imagens construídas"
}

# Iniciar serviços
start_services() {
    log "Iniciando serviços..."
    docker-compose -f docker-compose.prod.yml up -d
    success "Serviços iniciados"
}

# Aguardar serviços ficarem prontos
wait_for_services() {
    log "Aguardando serviços ficarem prontos..."
    
    services=("auth-service" "vehicles-service" "orders-service")
    for service in "${services[@]}"; do
        log "Aguardando $service..."
        timeout=60
        while [ $timeout -gt 0 ]; do
            if docker-compose -f docker-compose.prod.yml exec -T "$service" sh -c "curl -f http://localhost:3001/health > /dev/null 2>&1" 2>/dev/null; then
                success "$service está pronto"
                break
            fi
            sleep 2
            timeout=$((timeout - 2))
        done
        
        if [ $timeout -le 0 ]; then
            warning "$service pode não estar totalmente pronto"
        fi
    done
}

# Executar seed do banco
run_seed() {
    log "Executando seed do banco de dados..."
    docker-compose -f docker-compose.prod.yml exec -T auth-service npm run seed
    success "Seed executado"
}

# Verificar health dos serviços
check_health() {
    log "Verificando health dos serviços..."
    
    services=(
        "http://localhost:3001/health"
        "http://localhost:3002/health"
        "http://localhost:3003/health"
    )
    
    for url in "${services[@]}"; do
        if curl -f "$url" > /dev/null 2>&1; then
            success "Health check OK: $url"
        else
            warning "Health check falhou: $url"
        fi
    done
}

# Mostrar informações finais
show_info() {
    log "Deploy concluído com sucesso!"
    echo ""
    echo -e "${GREEN}🌐 URLs dos serviços:${NC}"
    echo -e "${YELLOW}   Auth Service:${NC} http://localhost:3001"
    echo -e "${YELLOW}   Vehicles Service:${NC} http://localhost:3002"
    echo -e "${YELLOW}   Orders Service:${NC} http://localhost:3003"
    echo ""
    echo -e "${GREEN}📋 Comandos úteis:${NC}"
    echo -e "${YELLOW}   Logs:${NC} docker-compose -f docker-compose.prod.yml logs -f"
    echo -e "${YELLOW}   Status:${NC} docker-compose -f docker-compose.prod.yml ps"
    echo -e "${YELLOW}   Parar:${NC} docker-compose -f docker-compose.prod.yml down"
    echo ""
    echo -e "${GREEN}🔐 Usuários de teste:${NC}"
    echo -e "${YELLOW}   Admin:${NC} admin@revenda.com / admin123"
    echo -e "${YELLOW}   Vendedor:${NC} vendedor@revenda.com / vendedor123"
    echo -e "${YELLOW}   Cliente:${NC} cliente@revenda.com / cliente123"
}

# Função principal
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  DEPLOY PARA PRODUÇÃO - REVENDA VEÍCULOS${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    check_docker
    check_docker_compose
    check_env_file
    
    echo ""
    log "Iniciando processo de deploy..."
    
    backup_database
    stop_services
    cleanup_images
    build_images
    start_services
    wait_for_services
    run_seed
    check_health
    
    echo ""
    show_info
}

# Executar função principal
main "$@" 