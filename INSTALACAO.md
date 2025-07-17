# Guia de Instalação - Plataforma de Revenda de Veículos

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Node.js** (versão 18 ou superior) - para desenvolvimento local
- **Git** (para clonar o repositório)

### Verificando as instalações

```bash
# Verificar Docker
docker --version

# Verificar Docker Compose
docker-compose --version

# Verificar Node.js
node --version

# Verificar Git
git --version
```

## Instalação Rápida (Recomendado)

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd fase-3
```

### 2. Configurar variáveis de ambiente (opcional)

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar as variáveis conforme necessário
nano .env
```

### 3. Executar instalação completa

```bash
make setup
```

Este comando irá:
- Verificar se todas as dependências estão instaladas
- Instalar dependências dos serviços
- Criar diretórios necessários
- Construir e iniciar os containers
- Executar seed do banco de dados
- Criar usuários de teste

### 4. Acessar a aplicação

Após a execução, você poderá acessar:

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Vehicles Service**: http://localhost:3002
- **Orders Service**: http://localhost:3003

### 5. Verificar instalação

```bash
# Verificar status dos serviços
make health

# Testar login
make test-login

# Ver todos os comandos disponíveis
make help
```

## Instalação Manual

Se preferir fazer a instalação manualmente:

### 1. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar as variáveis conforme necessário
nano .env
```

### 2. Instalar dependências dos serviços

```bash
# Auth Service
cd services/auth-service
npm install
cd ../..

# Vehicles Service
cd services/vehicles-service
npm install
cd ../..

# Orders Service
cd services/orders-service
npm install
cd ../..
```

### 3. Criar diretórios de logs

```bash
mkdir -p services/auth-service/logs
mkdir -p services/vehicles-service/logs
mkdir -p services/orders-service/logs
```

### 4. Iniciar serviços com Docker Compose

```bash
# Construir e iniciar todos os serviços
docker-compose up --build -d

# Verificar se todos os serviços estão rodando
docker-compose ps
```

### 5. Executar seed do banco de dados

```bash
# Aguardar alguns segundos para o MongoDB inicializar
sleep 10

# Executar seed
docker-compose exec auth-service npm run seed
```

## Usuários de Teste

Após a instalação, os seguintes usuários estarão disponíveis:

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@revenda.com | admin123 | Admin |
| vendedor@revenda.com | vendedor123 | Vendedor |
| cliente@revenda.com | cliente123 | Cliente |

## Verificação da Instalação

### 1. Verificar health dos serviços

```bash
# Auth Service
curl http://localhost:3001/health

# Vehicles Service
curl http://localhost:3002/health

# Orders Service
curl http://localhost:3003/health
```

### 2. Executar testes de integração

```bash
# Instalar axios para os testes
npm install axios

# Executar testes
node tests/integration.test.js
```

### 3. Testar login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@revenda.com", "senha": "admin123"}'
```

## Comandos Makefile (Recomendado)

### Comandos Principais

```bash
# Ver todos os comandos disponíveis
make help

# Gerenciamento básico
make start      # Inicia todos os serviços
make stop       # Para todos os serviços
make restart    # Reinicia todos os serviços
make logs       # Mostra logs em tempo real
make health     # Verifica status dos serviços

# Desenvolvimento
make dev        # Modo desenvolvimento (logs em tempo real)
make test       # Executa testes de integração
make seed       # Executa seed do banco

# Limpeza
make clean      # Remove containers e volumes
make clean-all  # Remove tudo (incluindo node_modules)
```

### Comandos Avançados

```bash
# Logs específicos
make logs-auth      # Logs do auth service
make logs-vehicles  # Logs do vehicles service
make logs-orders    # Logs do orders service

# Desenvolvimento individual
make dev-auth       # Executa auth service localmente
make dev-vehicles   # Executa vehicles service localmente
make dev-orders     # Executa orders service localmente

# Build individual
make build-auth     # Reconstrói auth service
make build-vehicles # Reconstrói vehicles service
make build-orders   # Reconstrói orders service

# Troubleshooting
make check-deps     # Verifica dependências
make check-ports    # Verifica portas em uso
make check-logs     # Verifica logs de erro
make status         # Mostra status dos containers
make rebuild        # Reconstrói todos os containers
```

### Comandos de Banco de Dados

```bash
make mongodb        # Acessa o MongoDB
make backup         # Faz backup do banco
make restore        # Restaura backup (especificar BACKUP_DATE)
```

## Comandos Docker Compose (Alternativo)

### Gerenciamento de Containers

```bash
# Parar todos os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart auth-service

# Ver logs de um serviço
docker-compose logs -f auth-service

# Ver logs de todos os serviços
docker-compose logs -f

# Reconstruir um serviço
docker-compose up --build auth-service
```

### Desenvolvimento Local

```bash
# Executar serviço localmente (sem Docker)
cd services/auth-service
npm run dev

# Executar testes
npm test

# Executar seed
npm run seed
```

### Banco de Dados

```bash
# Acessar MongoDB
docker-compose exec mongodb mongosh

# Fazer backup
docker-compose exec mongodb mongodump --out /backup

# Restaurar backup
docker-compose exec mongodb mongorestore /backup
```

## Estrutura do Projeto

```
fase-3/
├── services/
│   ├── auth-service/          # Serviço de autenticação
│   ├── vehicles-service/      # Serviço de veículos
│   └── orders-service/        # Serviço de pedidos
├── frontend/                  # Frontend React (a ser implementado)
├── infrastructure/
│   ├── docker/               # Configurações Docker
│   ├── k8s/                  # Configurações Kubernetes
│   └── ci-cd/                # Pipelines CI/CD
├── docs/                     # Documentação
├── tests/                    # Testes de integração
├── scripts/                  # Scripts de automação
├── docker-compose.yml        # Orquestração local
└── README.md                 # Documentação principal
```

## Troubleshooting

### Problemas Comuns

#### 1. Porta já em uso

```bash
# Verificar processos usando as portas
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Matar processo se necessário
kill -9 <PID>
```

#### 2. MongoDB não conecta

```bash
# Verificar se o MongoDB está rodando
docker-compose ps mongodb

# Verificar logs do MongoDB
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb
```

#### 3. Erro de permissão

```bash
# Dar permissão aos scripts
chmod +x scripts/*.sh

# Verificar permissões dos diretórios
ls -la services/
```

#### 4. Dependências não instaladas

```bash
# Limpar node_modules e reinstalar
cd services/auth-service
rm -rf node_modules package-lock.json
npm install
cd ../..
```

### Logs e Debug

```bash
# Ver logs em tempo real
docker-compose logs -f --tail=100

# Ver logs de erro
docker-compose logs --tail=50 | grep ERROR

# Ver logs de um serviço específico
docker-compose logs auth-service | grep -i error
```

## Configuração de Produção

Para configuração de produção, considere:

1. **Variáveis de ambiente**: Usar secrets management
2. **SSL/TLS**: Configurar HTTPS
3. **Monitoramento**: Implementar Prometheus/Grafana
4. **Logs**: Centralizar logs com ELK Stack
5. **Backup**: Configurar backup automático do MongoDB
6. **Scaling**: Configurar Kubernetes para auto-scaling

## Suporte

Para problemas ou dúvidas:

1. Verificar a documentação em `docs/`
2. Consultar os logs dos serviços
3. Executar os testes de integração
4. Verificar se todos os pré-requisitos estão instalados

## Próximos Passos

Após a instalação bem-sucedida:

1. Implementar o frontend React
2. Configurar CI/CD pipelines
3. Implementar testes unitários
4. Configurar monitoramento
5. Implementar funcionalidades adicionais 