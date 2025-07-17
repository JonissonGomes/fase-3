# Documentação da API - Plataforma de Revenda de Veículos

## Visão Geral

A plataforma é composta por três microserviços principais, cada um com suas responsabilidades específicas:

- **Auth Service** (Porta 3001): Autenticação e gerenciamento de usuários
- **Vehicles Service** (Porta 3002): Gerenciamento de veículos
- **Orders Service** (Porta 3003): Gerenciamento de pedidos

## Autenticação

Todos os endpoints protegidos requerem um token JWT no header `Authorization: Bearer <token>`.

### Perfis de Usuário

- **Cliente**: Pode comprar veículos e visualizar veículos à venda
- **Vendedor**: Pode cadastrar/editar veículos, visualizar veículos vendidos
- **Admin**: Acesso total a todas as funcionalidades

---

## Auth Service (Porta 3001)

### Base URL: `http://localhost:3001`

#### POST /auth/login
**Público** - Autenticar usuário

**Body:**
```json
{
  "email": "admin@revenda.com",
  "senha": "admin123"
}
```

**Response:**
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "Administrador Sistema",
    "email": "admin@revenda.com",
    "perfil": "Admin",
    "ativo": true
  },
  "expiraEm": "24h"
}
```

#### POST /auth/register
**Admin** - Cadastrar novo usuário

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "cpf": "123.456.789-00",
  "perfil": "Cliente"
}
```

#### GET /auth/me
**Autenticado** - Obter dados do usuário logado

#### GET /auth/users
**Admin** - Listar usuários (com paginação)

**Query Parameters:**
- `pagina`: Número da página (padrão: 1)
- `limite`: Itens por página (padrão: 10)
- `perfil`: Filtrar por perfil
- `ativo`: Filtrar por status ativo
- `busca`: Buscar por nome, email ou CPF

#### PUT /auth/users/:id
**Admin ou próprio usuário** - Atualizar usuário

#### DELETE /auth/users/:id
**Admin** - Desativar usuário

---

## Vehicles Service (Porta 3002)

### Base URL: `http://localhost:3002`

#### GET /vehicles
**Público** - Listar veículos à venda

**Query Parameters:**
- `pagina`: Número da página (padrão: 1)
- `limite`: Itens por página (padrão: 10)
- `marca`: Filtrar por marca
- `modelo`: Filtrar por modelo
- `anoMin`: Ano mínimo
- `anoMax`: Ano máximo
- `precoMin`: Preço mínimo
- `precoMax`: Preço máximo
- `combustivel`: Tipo de combustível
- `transmissao`: Tipo de transmissão
- `ordenacao`: Ordenação (preco, preco-desc, ano, data)

**Response:**
```json
{
  "veiculos": [
    {
      "id": "507f1f77bcf86cd799439011",
      "marca": "Toyota",
      "modelo": "Corolla",
      "ano": 2020,
      "cor": "Prata",
      "preco": 85000,
      "status": "à venda",
      "combustivel": "Flex",
      "transmissao": "Automático",
      "vendedor": {
        "id": "507f1f77bcf86cd799439012",
        "nome": "João Vendedor",
        "email": "vendedor@revenda.com"
      }
    }
  ],
  "paginacao": {
    "pagina": 1,
    "totalPaginas": 5,
    "totalVeiculos": 50,
    "veiculosPorPagina": 10
  }
}
```

#### GET /vehicles/:id
**Público** - Buscar veículo específico

#### POST /vehicles
**Vendedor/Admin** - Criar veículo

**Body:**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2020,
  "cor": "Prata",
  "preco": 85000,
  "descricao": "Veículo em excelente estado",
  "quilometragem": 45000,
  "combustivel": "Flex",
  "transmissao": "Automático",
  "imagens": [
    "https://example.com/imagem1.jpg"
  ]
}
```

#### PUT /vehicles/:id
**Vendedor do veículo/Admin** - Atualizar veículo

#### DELETE /vehicles/:id
**Vendedor do veículo/Admin** - Remover veículo

#### GET /vehicles/sold
**Vendedor/Admin** - Listar veículos vendidos

#### GET /vehicles/my
**Vendedor/Admin** - Listar meus veículos

---

## Orders Service (Porta 3003)

### Base URL: `http://localhost:3003`

#### POST /orders
**Cliente/Admin** - Criar pedido

**Body:**
```json
{
  "veiculoId": "507f1f77bcf86cd799439011",
  "precoFinal": 85000,
  "observacoes": "Interessado em financiamento",
  "metodoPagamento": "cartao_credito",
  "parcelas": 12,
  "valorParcela": 7083.33
}
```

#### GET /orders
**Autenticado** - Listar meus pedidos

**Query Parameters:**
- `pagina`: Número da página (padrão: 1)
- `limite`: Itens por página (padrão: 10)
- `status`: Filtrar por status

#### GET /orders/vendor
**Vendedor/Admin** - Listar pedidos recebidos

#### GET /orders/:id
**Comprador/Vendedor/Admin** - Buscar pedido específico

#### PUT /orders/:id/approve
**Vendedor/Admin** - Aprovar pedido

#### PUT /orders/:id/reject
**Vendedor/Admin** - Rejeitar pedido

**Body:**
```json
{
  "observacoes": "Veículo já foi vendido"
}
```

#### PUT /orders/:id/complete
**Vendedor/Admin** - Concluir pedido

#### PUT /orders/:id/cancel
**Comprador/Admin** - Cancelar pedido

**Body:**
```json
{
  "observacoes": "Mudei de ideia"
}
```

---

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `401`: Não autenticado
- `403`: Acesso negado
- `404`: Recurso não encontrado
- `409`: Conflito (ex: email já cadastrado)
- `429`: Rate limit excedido
- `500`: Erro interno do servidor

## Códigos de Erro

Todos os erros retornam um objeto com:
- `erro`: Mensagem descritiva do erro
- `codigo`: Código único do erro para tratamento programático

**Exemplos de códigos:**
- `TOKEN_MISSING`: Token não fornecido
- `INVALID_CREDENTIALS`: Credenciais inválidas
- `INSUFFICIENT_PERMISSIONS`: Perfil insuficiente
- `VEHICLE_NOT_FOUND`: Veículo não encontrado
- `VEHICLE_ALREADY_SOLD`: Veículo já vendido
- `ORDER_NOT_FOUND`: Pedido não encontrado

---

## Exemplos de Uso

### Fluxo Completo de Compra

1. **Login do Cliente:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "cliente@revenda.com", "senha": "cliente123"}'
```

2. **Listar Veículos Disponíveis:**
```bash
curl http://localhost:3002/vehicles
```

3. **Criar Pedido:**
```bash
curl -X POST http://localhost:3003/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"veiculoId": "507f1f77bcf86cd799439011", "precoFinal": 85000}'
```

4. **Vendedor Aprova Pedido:**
```bash
curl -X PUT http://localhost:3003/orders/<order-id>/approve \
  -H "Authorization: Bearer <vendedor-token>"
```

### Gerenciamento de Veículos (Vendedor)

1. **Criar Veículo:**
```bash
curl -X POST http://localhost:3002/vehicles \
  -H "Authorization: Bearer <vendedor-token>" \
  -H "Content-Type: application/json" \
  -d '{"marca": "Toyota", "modelo": "Corolla", "ano": 2020, "cor": "Prata", "preco": 85000}'
```

2. **Listar Meus Veículos:**
```bash
curl http://localhost:3002/vehicles/my \
  -H "Authorization: Bearer <vendedor-token>"
```

3. **Atualizar Veículo:**
```bash
curl -X PUT http://localhost:3002/vehicles/<vehicle-id> \
  -H "Authorization: Bearer <vendedor-token>" \
  -H "Content-Type: application/json" \
  -d '{"preco": 82000}'
```

---

## Monitoramento

### Health Checks

Cada serviço possui um endpoint de health check:

- `GET /health` - Retorna status do serviço

**Response:**
```json
{
  "status": "OK",
  "service": "auth-service",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### Logs

Os serviços geram logs estruturados em JSON com:
- Timestamp
- Nível de log (info, warn, error)
- Serviço
- Mensagem
- Dados adicionais

---

## Segurança

### Rate Limiting
- 100 requisições por IP por 15 minutos (global)
- 5 tentativas de login por usuário por 15 minutos

### Validação
- Todos os inputs são validados com Joi
- Sanitização de dados
- Proteção contra injeção

### CORS
- Configurado para permitir apenas o frontend
- Credenciais habilitadas

### Headers de Segurança
- Helmet.js para headers de segurança
- Content Security Policy
- XSS Protection 