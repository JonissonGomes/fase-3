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

## Documentação

- [API Documentation](docs/API.md)
- [Guia de Instalação](INSTALACAO.md)
- [Análise da Arquitetura](ANALISE_ARQUITETURA.md)
- [Documentação do Makefile](docs/MAKEFILE.md)
- [Collection do Postman](docs/Revenda_Veiculos_API.postman_collection.json)
- [Guia do Postman](docs/POSTMAN_GUIDE.md)