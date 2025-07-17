# Plataforma de Revenda de Veículos

## Visão Geral
Plataforma web completa para revenda de veículos com arquitetura de microserviços, autenticação JWT e controle de acesso baseado em perfis (Cliente, Vendedor, Admin).

## Arquitetura

### Microserviços
- **auth-service**: Autenticação e gerenciamento de usuários (PostgreSQL)
- **vehicles-service**: Gerenciamento de veículos (MongoDB)
- **orders-service**: Gerenciamento de pedidos (MongoDB)

### Frontend
- **frontend**: Interface React com Tailwind CSS

### Infraestrutura
- Docker para containerização
- Kubernetes para orquestração
- API Gateway para roteamento
- CI/CD com GitHub Actions

## Perfis de Usuário

### Cliente
- Visualizar veículos à venda
- Comprar veículos
- Visualizar histórico de compras

### Vendedor
- Cadastrar e editar veículos
- Visualizar veículos à venda e vendidos
- Todas as funcionalidades de Cliente

### Admin
- Gerenciar usuários
- Acesso total a todas as funcionalidades
- Todas as funcionalidades de Cliente e Vendedor

## Tecnologias

### Backend
- Node.js com Express
- JWT para autenticação
- MongoDB (veículos e pedidos)
- PostgreSQL (usuários)
- Jest para testes

### Frontend
- React 18
- Tailwind CSS
- Context API para gerenciamento de estado
- Axios para comunicação com APIs

### DevOps
- Docker
- Kubernetes
- GitHub Actions
- Prometheus/Grafana para monitoramento

## Estrutura do Projeto

```
fase-3/
├── services/
│   ├── auth-service/
│   ├── vehicles-service/
│   └── orders-service/
├── frontend/
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   └── ci-cd/
└── docs/
```

## Como Executar

### Instalação Rápida (Recomendado)
```bash
# Configurar ambiente completo
make setup

# Ou passo a passo:
make install    # Instala dependências
make start      # Inicia serviços
make seed       # Popula banco com dados de teste
```

### Comandos Principais
```bash
make help       # Mostra todos os comandos disponíveis
make start      # Inicia todos os serviços
make stop       # Para todos os serviços
make restart    # Reinicia todos os serviços
make logs       # Mostra logs em tempo real
make health     # Verifica status dos serviços
make test       # Executa testes de integração
make clean      # Remove containers e volumes
```

### Desenvolvimento Local
```bash
# Modo desenvolvimento (logs em tempo real)
make dev

# Executar serviço individual localmente
make dev-auth
make dev-vehicles
make dev-orders

# Ver logs de serviço específico
make logs-auth
make logs-vehicles
make logs-orders
```

### Troubleshooting
```bash
make check-deps     # Verifica dependências
make check-ports    # Verifica portas em uso
make check-logs     # Verifica logs de erro
make status         # Mostra status dos containers
make rebuild        # Reconstrói containers
```

### Produção
```bash
# Configuração para produção
make prod-setup

# Deploy no Kubernetes
kubectl apply -f infrastructure/k8s/
```

## APIs

### Autenticação
- `POST /auth/register` - Cadastrar usuário (Admin)
- `POST /auth/login` - Login
- `GET /auth/users` - Listar usuários (Admin)
- `PUT /auth/users/:id` - Atualizar usuário (Admin)

### Veículos
- `POST /vehicles` - Criar veículo (Vendedor, Admin)
- `PUT /vehicles/:id` - Atualizar veículo (Vendedor, Admin)
- `GET /vehicles` - Listar veículos à venda (todos)
- `GET /vehicles/sold` - Listar veículos vendidos (Vendedor, Admin)

### Pedidos
- `POST /orders` - Criar pedido (Cliente, Admin)
- `GET /orders` - Listar pedidos (Cliente, Admin)

## Segurança
- HTTPS para todas as comunicações
- JWT com expiração
- Controle de acesso baseado em perfis
- Rate limiting
- Validação de entrada

## Testes
- Cobertura mínima de 80%
- Testes unitários e de integração
- Testes de carga com Artillery

## Monitoramento
- Métricas com Prometheus
- Visualização com Grafana
- Logs centralizados
- Alertas automáticos

## 🚀 Deploy Público (MVP)

### Status: ✅ PRONTO PARA PUBLICAÇÃO

Este projeto está **pronto para publicação pública como MVP**! Após análise completa de segurança, todos os microserviços estão funcionais e seguros para deploy.

### 🎯 O que está incluído:
- ✅ **3 Microserviços funcionais** (Auth, Vehicles, Orders)
- ✅ **Autenticação JWT** com controle de perfis
- ✅ **Banco MongoDB** com dados de seed
- ✅ **Docker Compose** para deploy fácil
- ✅ **Documentação completa** e ferramentas de desenvolvimento
- ✅ **Coleção Postman** para testes da API
- ✅ **Makefile** com comandos automatizados

### 🌐 Opções de Deploy:

#### 1. Deploy Local/Desenvolvimento
```bash
# Setup completo
make setup

# Ou deploy de produção
make prod-deploy
```

#### 2. Deploy Backend no Render + Frontend na Vercel (Recomendado)
```bash
# Backend (Render)
./scripts/setup-render.sh

# Frontend (Vercel)
# 1. Conecte o repositório na Vercel
# 2. Configure o diretório frontend/
# 3. Configure variáveis de ambiente
```

#### 3. Deploy em Outras Clouds
- **Railway**: Similar ao Render, suporte a monorepo
- **Heroku**: Deploy dos microserviços com MongoDB Atlas
- **DigitalOcean/AWS**: VPS com Docker e MongoDB Atlas

#### 4. Deploy com Script Automatizado
```bash
# Script de deploy completo
./scripts/deploy-prod.sh
```

### 🔐 Segurança para MVP:
- ✅ Arquivos sensíveis no `.gitignore`
- ✅ Variáveis de ambiente configuráveis
- ✅ JWT com chave configurável
- ✅ CORS configurado adequadamente
- ✅ Rate limiting implementado

### 📚 Documentação Completa:
- [Deploy no Render](docs/DEPLOY_RENDER.md) - Backend (microserviços)
- [Deploy na Vercel](docs/DEPLOY_VERCEL.md) - Frontend (React/Vue)
- [Preparação para Publicação](docs/PREPARACAO_PUBLICACAO.md)
- [API Documentation](docs/API.md)
- [Guia de Instalação](INSTALACAO.md)
- [Documentação do Makefile](docs/MAKEFILE.md)
- [Collection do Postman](docs/Revenda_Veiculos_API.postman_collection.json)
- [Guia do Postman](docs/POSTMAN_GUIDE.md)

### 🔄 Próximos Passos:
1. **Imediato**: Publicar no GitHub e fazer deploy
2. **Curto Prazo**: Implementar frontend React/Vue
3. **Médio Prazo**: Adicionar testes automatizados e CI/CD