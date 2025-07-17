# Makefile - Plataforma de Revenda de Veículos
# Comandos para instalação, execução e gerenciamento da aplicação

.PHONY: help install setup dev start stop restart logs clean test seed health check-deps

# Variáveis
DOCKER_COMPOSE = docker-compose
SERVICES = auth-service vehicles-service orders-service
FRONTEND_URL = http://localhost:3000
AUTH_URL = http://localhost:3001
VEHICLES_URL = http://localhost:3002
ORDERS_URL = http://localhost:3003

# Cores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Comando padrão
.DEFAULT_GOAL := help

help: ## Mostra esta ajuda
	@echo "$(BLUE)🚗 Plataforma de Revenda de Veículos$(NC)"
	@echo "$(BLUE)=====================================$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)URLs da aplicação:$(NC)"
	@echo "  Frontend:     $(FRONTEND_URL)"
	@echo "  Auth Service: $(AUTH_URL)"
	@echo "  Vehicles:     $(VEHICLES_URL)"
	@echo "  Orders:       $(ORDERS_URL)"
	@echo ""
	@echo "$(GREEN)Usuários de teste:$(NC)"
	@echo "  Admin:    admin@revenda.com / admin123"
	@echo "  Vendedor: vendedor@revenda.com / vendedor123"
	@echo "  Cliente:  cliente@revenda.com / cliente123"

check-deps: ## Verifica se as dependências estão instaladas
	@echo "$(BLUE)🔍 Verificando dependências...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)❌ Docker não está instalado$(NC)"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "$(RED)❌ Docker Compose não está instalado$(NC)"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "$(RED)❌ Node.js não está instalado$(NC)"; exit 1; }
	@echo "$(GREEN)✅ Todas as dependências estão instaladas$(NC)"

install: check-deps ## Instala dependências dos serviços
	@echo "$(BLUE)📦 Instalando dependências dos serviços...$(NC)"
	@for service in $(SERVICES); do \
		echo "$(YELLOW)Instalando $$service...$(NC)"; \
		cd services/$$service && npm install && cd ../..; \
	done
	@echo "$(GREEN)✅ Dependências instaladas com sucesso$(NC)"

setup: check-deps ## Configura o ambiente completo (instala + inicia + seed)
	@echo "$(BLUE)🚀 Configurando ambiente completo...$(NC)"
	@$(MAKE) install
	@$(MAKE) create-dirs
	@$(MAKE) start
	@echo "$(YELLOW)⏳ Aguardando serviços ficarem prontos...$(NC)"
	@sleep 30
	@$(MAKE) seed
	@echo "$(GREEN)🎉 Ambiente configurado com sucesso!$(NC)"
	@echo "$(BLUE)📋 Acesse: $(FRONTEND_URL)$(NC)"

create-dirs: ## Cria diretórios necessários
	@echo "$(BLUE)📁 Criando diretórios de logs...$(NC)"
	@mkdir -p services/auth-service/logs
	@mkdir -p services/vehicles-service/logs
	@mkdir -p services/orders-service/logs
	@echo "$(GREEN)✅ Diretórios criados$(NC)"

start: ## Inicia todos os serviços
	@echo "$(BLUE)🐳 Iniciando serviços...$(NC)"
	@$(DOCKER_COMPOSE) up --build -d
	@echo "$(GREEN)✅ Serviços iniciados$(NC)"
	@echo "$(BLUE)📋 URLs:$(NC)"
	@echo "  Frontend: $(FRONTEND_URL)"
	@echo "  Auth:     $(AUTH_URL)"
	@echo "  Vehicles: $(VEHICLES_URL)"
	@echo "  Orders:   $(ORDERS_URL)"

stop: ## Para todos os serviços
	@echo "$(BLUE)🛑 Parando serviços...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Serviços parados$(NC)"

restart: ## Reinicia todos os serviços
	@echo "$(BLUE)🔄 Reiniciando serviços...$(NC)"
	@$(MAKE) stop
	@$(MAKE) start
	@echo "$(GREEN)✅ Serviços reiniciados$(NC)"

logs: ## Mostra logs de todos os serviços
	@echo "$(BLUE)📋 Mostrando logs...$(NC)"
	@$(DOCKER_COMPOSE) logs -f

logs-auth: ## Mostra logs do serviço de autenticação
	@echo "$(BLUE)📋 Logs do Auth Service...$(NC)"
	@$(DOCKER_COMPOSE) logs -f auth-service

logs-vehicles: ## Mostra logs do serviço de veículos
	@echo "$(BLUE)📋 Logs do Vehicles Service...$(NC)"
	@$(DOCKER_COMPOSE) logs -f vehicles-service

logs-orders: ## Mostra logs do serviço de pedidos
	@echo "$(BLUE)📋 Logs do Orders Service...$(NC)"
	@$(DOCKER_COMPOSE) logs -f orders-service

seed: ## Executa seed do banco de dados
	@echo "$(BLUE)🌱 Executando seed do banco de dados...$(NC)"
	@$(DOCKER_COMPOSE) exec auth-service npm run seed
	@echo "$(GREEN)✅ Seed executado com sucesso$(NC)"

health: ## Verifica health de todos os serviços
	@echo "$(BLUE)🏥 Verificando health dos serviços...$(NC)"
	@echo "$(YELLOW)Auth Service:$(NC)"
	@curl -s $(AUTH_URL)/health | jq . 2>/dev/null || curl -s $(AUTH_URL)/health
	@echo "$(YELLOW)Vehicles Service:$(NC)"
	@curl -s $(VEHICLES_URL)/health | jq . 2>/dev/null || curl -s $(VEHICLES_URL)/health
	@echo "$(YELLOW)Orders Service:$(NC)"
	@curl -s $(ORDERS_URL)/health | jq . 2>/dev/null || curl -s $(ORDERS_URL)/health

test: ## Executa testes de integração
	@echo "$(BLUE)🧪 Executando testes de integração...$(NC)"
	@npm install axios 2>/dev/null || true
	@node tests/integration.test.js
	@echo "$(GREEN)✅ Testes concluídos$(NC)"

test-login: ## Testa login com usuário admin
	@echo "$(BLUE)🔐 Testando login...$(NC)"
	@curl -X POST $(AUTH_URL)/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email": "admin@revenda.com", "senha": "admin123"}' \
		| jq . 2>/dev/null || curl -X POST $(AUTH_URL)/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email": "admin@revenda.com", "senha": "admin123"}'

clean: ## Remove containers, volumes e imagens
	@echo "$(BLUE)🧹 Limpando ambiente...$(NC)"
	@$(DOCKER_COMPOSE) down -v --rmi all
	@echo "$(GREEN)✅ Ambiente limpo$(NC)"

clean-all: ## Remove tudo (containers, volumes, imagens e node_modules)
	@echo "$(BLUE)🧹 Limpeza completa...$(NC)"
	@$(MAKE) clean
	@for service in $(SERVICES); do \
		echo "$(YELLOW)Removendo node_modules de $$service...$(NC)"; \
		rm -rf services/$$service/node_modules; \
		rm -rf services/$$service/package-lock.json; \
	done
	@echo "$(GREEN)✅ Limpeza completa realizada$(NC)"

dev: ## Modo desenvolvimento (logs em tempo real)
	@echo "$(BLUE)🔧 Modo desenvolvimento...$(NC)"
	@$(DOCKER_COMPOSE) up --build

rebuild: ## Reconstrói todos os containers
	@echo "$(BLUE)🔨 Reconstruindo containers...$(NC)"
	@$(DOCKER_COMPOSE) down
	@$(DOCKER_COMPOSE) build --no-cache
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Containers reconstruídos$(NC)"

status: ## Mostra status dos containers
	@echo "$(BLUE)📊 Status dos containers...$(NC)"
	@$(DOCKER_COMPOSE) ps

shell-auth: ## Abre shell no container do auth service
	@echo "$(BLUE)🐚 Abrindo shell no Auth Service...$(NC)"
	@$(DOCKER_COMPOSE) exec auth-service sh

shell-vehicles: ## Abre shell no container do vehicles service
	@echo "$(BLUE)🐚 Abrindo shell no Vehicles Service...$(NC)"
	@$(DOCKER_COMPOSE) exec vehicles-service sh

shell-orders: ## Abre shell no container do orders service
	@echo "$(BLUE)🐚 Abrindo shell no Orders Service...$(NC)"
	@$(DOCKER_COMPOSE) exec orders-service sh

mongodb: ## Acessa o MongoDB
	@echo "$(BLUE)🗄️ Acessando MongoDB...$(NC)"
	@$(DOCKER_COMPOSE) exec mongodb mongosh

backup: ## Faz backup do banco de dados
	@echo "$(BLUE)💾 Fazendo backup do banco...$(NC)"
	@mkdir -p backups
	@$(DOCKER_COMPOSE) exec mongodb mongodump --out /backup
	@$(DOCKER_COMPOSE) cp mongodb:/backup ./backups/$(shell date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)✅ Backup realizado$(NC)"

restore: ## Restaura backup do banco de dados (especificar BACKUP_DATE)
	@if [ -z "$(BACKUP_DATE)" ]; then \
		echo "$(RED)❌ Especifique BACKUP_DATE=YYYYMMDD_HHMMSS$(NC)"; \
		echo "Exemplo: make restore BACKUP_DATE=20240115_143000"; \
		exit 1; \
	fi
	@echo "$(BLUE)📥 Restaurando backup $(BACKUP_DATE)...$(NC)"
	@$(DOCKER_COMPOSE) exec mongodb mongorestore /backup/$(BACKUP_DATE)
	@echo "$(GREEN)✅ Backup restaurado$(NC)"

# Comandos de desenvolvimento individual
dev-auth: ## Executa auth service localmente (sem Docker)
	@echo "$(BLUE)🔧 Executando Auth Service localmente...$(NC)"
	@cd services/auth-service && npm run dev

dev-vehicles: ## Executa vehicles service localmente (sem Docker)
	@echo "$(BLUE)🔧 Executando Vehicles Service localmente...$(NC)"
	@cd services/vehicles-service && npm run dev

dev-orders: ## Executa orders service localmente (sem Docker)
	@echo "$(BLUE)🔧 Executando Orders Service localmente...$(NC)"
	@cd services/orders-service && npm run dev

# Comandos de teste individual
test-auth: ## Executa testes do auth service
	@echo "$(BLUE)🧪 Testando Auth Service...$(NC)"
	@cd services/auth-service && npm test

test-vehicles: ## Executa testes do vehicles service
	@echo "$(BLUE)🧪 Testando Vehicles Service...$(NC)"
	@cd services/vehicles-service && npm test

test-orders: ## Executa testes do orders service
	@echo "$(BLUE)🧪 Testando Orders Service...$(NC)"
	@cd services/orders-service && npm test

# Comandos de seed individual
seed-auth: ## Executa seed apenas do auth service
	@echo "$(BLUE)🌱 Executando seed do Auth Service...$(NC)"
	@cd services/auth-service && npm run seed

# Comandos de build individual
build-auth: ## Reconstrói apenas o auth service
	@echo "$(BLUE)🔨 Reconstruindo Auth Service...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache auth-service
	@$(DOCKER_COMPOSE) up -d auth-service

build-vehicles: ## Reconstrói apenas o vehicles service
	@echo "$(BLUE)🔨 Reconstruindo Vehicles Service...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache vehicles-service
	@$(DOCKER_COMPOSE) up -d vehicles-service

build-orders: ## Reconstrói apenas o orders service
	@echo "$(BLUE)🔨 Reconstruindo Orders Service...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache orders-service
	@$(DOCKER_COMPOSE) up -d orders-service

# Comandos de restart individual
restart-auth: ## Reinicia apenas o auth service
	@echo "$(BLUE)🔄 Reiniciando Auth Service...$(NC)"
	@$(DOCKER_COMPOSE) restart auth-service

restart-vehicles: ## Reinicia apenas o vehicles service
	@echo "$(BLUE)🔄 Reiniciando Vehicles Service...$(NC)"
	@$(DOCKER_COMPOSE) restart vehicles-service

restart-orders: ## Reinicia apenas o orders service
	@echo "$(BLUE)🔄 Reiniciando Orders Service...$(NC)"
	@$(DOCKER_COMPOSE) restart orders-service

# Comandos de monitoramento
monitor: ## Monitora recursos dos containers
	@echo "$(BLUE)📊 Monitorando recursos...$(NC)"
	@$(DOCKER_COMPOSE) stats

# Comandos de troubleshooting
check-logs: ## Verifica logs de erro
	@echo "$(BLUE)🔍 Verificando logs de erro...$(NC)"
	@$(DOCKER_COMPOSE) logs --tail=50 | grep -i error || echo "$(GREEN)Nenhum erro encontrado$(NC)"

check-ports: ## Verifica se as portas estão em uso
	@echo "$(BLUE)🔍 Verificando portas...$(NC)"
	@for port in 3000 3001 3002 3003 27017; do \
		if lsof -i :$$port >/dev/null 2>&1; then \
			echo "$(YELLOW)Porta $$port está em uso$(NC)"; \
		else \
			echo "$(GREEN)Porta $$port está livre$(NC)"; \
		fi; \
	done

# Comandos de documentação
docs: ## Abre documentação da API
	@echo "$(BLUE)📚 Abrindo documentação...$(NC)"
	@if command -v open >/dev/null 2>&1; then \
		open docs/API.md; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open docs/API.md; \
	else \
		echo "$(YELLOW)Abra manualmente: docs/API.md$(NC)"; \
	fi

# Comandos de produção
prod-setup: ## Configuração para produção
	@echo "$(BLUE)🏭 Configurando para produção...$(NC)"
	@echo "$(YELLOW)⚠️  Ajuste as variáveis de ambiente em .env$(NC)"
	@echo "$(YELLOW)⚠️  Configure SSL/TLS$(NC)"
	@echo "$(YELLOW)⚠️  Configure monitoramento$(NC)"
	@echo "$(YELLOW)⚠️  Configure backup automático$(NC)"
	@echo "$(GREEN)✅ Verifique a documentação de produção$(NC)" 