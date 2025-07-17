# Documentação do Makefile

## Visão Geral

O Makefile da plataforma de revenda de veículos fornece uma interface simples e padronizada para gerenciar todos os aspectos da aplicação, desde instalação até produção.

## Comandos Principais

### 🚀 Instalação e Setup

| Comando | Descrição |
|---------|-----------|
| `make help` | Mostra todos os comandos disponíveis |
| `make check-deps` | Verifica se as dependências estão instaladas |
| `make install` | Instala dependências dos serviços |
| `make setup` | Configura o ambiente completo (instala + inicia + seed) |
| `make create-dirs` | Cria diretórios necessários |

### 🐳 Gerenciamento de Containers

| Comando | Descrição |
|---------|-----------|
| `make start` | Inicia todos os serviços |
| `make stop` | Para todos os serviços |
| `make restart` | Reinicia todos os serviços |
| `make status` | Mostra status dos containers |
| `make rebuild` | Reconstrói todos os containers |

### 📋 Logs e Monitoramento

| Comando | Descrição |
|---------|-----------|
| `make logs` | Mostra logs de todos os serviços |
| `make logs-auth` | Mostra logs do auth service |
| `make logs-vehicles` | Mostra logs do vehicles service |
| `make logs-orders` | Mostra logs do orders service |
| `make health` | Verifica health de todos os serviços |
| `make monitor` | Monitora recursos dos containers |

### 🧪 Testes e Qualidade

| Comando | Descrição |
|---------|-----------|
| `make test` | Executa testes de integração |
| `make test-login` | Testa login com usuário admin |
| `make test-auth` | Executa testes do auth service |
| `make test-vehicles` | Executa testes do vehicles service |
| `make test-orders` | Executa testes do orders service |

### 🗄️ Banco de Dados

| Comando | Descrição |
|---------|-----------|
| `make seed` | Executa seed do banco de dados |
| `make seed-auth` | Executa seed apenas do auth service |
| `make mongodb` | Acessa o MongoDB |
| `make backup` | Faz backup do banco de dados |
| `make restore` | Restaura backup (especificar BACKUP_DATE) |

### 🧹 Limpeza

| Comando | Descrição |
|---------|-----------|
| `make clean` | Remove containers, volumes e imagens |
| `make clean-all` | Remove tudo (incluindo node_modules) |

## Comandos de Desenvolvimento

### 🔧 Desenvolvimento Individual

```bash
# Executar serviço localmente (sem Docker)
make dev-auth       # Auth service
make dev-vehicles   # Vehicles service
make dev-orders     # Orders service

# Modo desenvolvimento (logs em tempo real)
make dev
```

### 🔨 Build Individual

```bash
# Reconstruir serviço específico
make build-auth     # Auth service
make build-vehicles # Vehicles service
make build-orders   # Orders service
```

### 🔄 Restart Individual

```bash
# Reiniciar serviço específico
make restart-auth     # Auth service
make restart-vehicles # Vehicles service
make restart-orders   # Orders service
```

## Comandos de Troubleshooting

### 🔍 Diagnóstico

```bash
# Verificar dependências
make check-deps

# Verificar portas em uso
make check-ports

# Verificar logs de erro
make check-logs

# Verificar status dos containers
make status
```

### 🐚 Shell nos Containers

```bash
# Abrir shell em container específico
make shell-auth      # Auth service
make shell-vehicles  # Vehicles service
make shell-orders    # Orders service
```

## Comandos de Produção

### 🏭 Configuração de Produção

```bash
# Configuração inicial para produção
make prod-setup
```

### 💾 Backup e Restore

```bash
# Fazer backup
make backup

# Restaurar backup (especificar data)
make restore BACKUP_DATE=20240115_143000
```

## Exemplos de Uso

### Cenário 1: Primeira Instalação

```bash
# 1. Clone o repositório
git clone <url>
cd fase-3

# 2. Configurar ambiente (opcional)
cp env.example .env

# 3. Instalação completa
make setup

# 4. Verificar instalação
make health
make test-login
```

### Cenário 2: Desenvolvimento Diário

```bash
# Iniciar serviços
make start

# Ver logs em tempo real
make logs

# Executar testes
make test

# Parar serviços
make stop
```

### Cenário 3: Debug de Problemas

```bash
# Verificar dependências
make check-deps

# Verificar portas
make check-ports

# Ver logs de erro
make check-logs

# Reconstruir containers
make rebuild
```

### Cenário 4: Desenvolvimento Individual

```bash
# Trabalhar apenas no auth service
make dev-auth

# Em outro terminal, ver logs
make logs-auth
```

## Variáveis de Ambiente

O Makefile usa as seguintes variáveis:

```makefile
DOCKER_COMPOSE = docker-compose
SERVICES = auth-service vehicles-service orders-service
FRONTEND_URL = http://localhost:3000
AUTH_URL = http://localhost:3001
VEHICLES_URL = http://localhost:3002
ORDERS_URL = http://localhost:3003
```

## URLs da Aplicação

Após iniciar os serviços:

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Vehicles Service**: http://localhost:3002
- **Orders Service**: http://localhost:3003

## Usuários de Teste

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@revenda.com | admin123 | Admin |
| vendedor@revenda.com | vendedor123 | Vendedor |
| cliente@revenda.com | cliente123 | Cliente |

## Dicas e Boas Práticas

### 1. Sempre use `make help` primeiro
```bash
make help
```

### 2. Para desenvolvimento, use `make dev`
```bash
make dev  # Logs em tempo real
```

### 3. Para verificar problemas, use os comandos de troubleshooting
```bash
make check-deps
make check-ports
make check-logs
```

### 4. Para limpeza completa
```bash
make clean-all  # Remove tudo
```

### 5. Para backup regular
```bash
make backup  # Faz backup automático com timestamp
```

## Troubleshooting

### Problema: Comando não encontrado
```bash
# Verificar se o make está instalado
make --version

# No Windows, pode ser necessário usar
mingw32-make
```

### Problema: Permissão negada
```bash
# Verificar permissões
ls -la Makefile

# Dar permissão se necessário
chmod +x Makefile
```

### Problema: Docker não encontrado
```bash
# Verificar se o Docker está rodando
docker ps

# Iniciar Docker se necessário
# (depende do seu sistema operacional)
```

### Problema: Porta em uso
```bash
# Verificar portas
make check-ports

# Parar serviços conflitantes
make stop
```

## Contribuição

Para adicionar novos comandos ao Makefile:

1. Adicione o comando com documentação
2. Use o formato: `comando: ## Descrição`
3. Atualize esta documentação
4. Teste o comando antes de commitar

## Referências

- [Makefile Tutorial](https://makefiletutorial.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Exemplos de Uso](EXEMPLOS_USO.md) 