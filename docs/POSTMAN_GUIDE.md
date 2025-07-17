# Guia do Postman - Plataforma de Revenda de Veículos

## 📋 Visão Geral

Este guia explica como usar a collection do Postman para testar todos os endpoints da plataforma de revenda de veículos.

## 🚀 Configuração Inicial

### 1. Importar Collection e Environment

1. **Abra o Postman**
2. **Importe a Collection:**
   - Clique em "Import"
   - Selecione o arquivo `Revenda_Veiculos_API.postman_collection.json`
3. **Importe o Environment:**
   - Clique em "Import"
   - Selecione o arquivo `Revenda_Veiculos_Environment.postman_environment.json`
4. **Selecione o Environment:**
   - No canto superior direito, selecione "Revenda Veículos - Local"

### 2. Verificar Serviços

Certifique-se de que os serviços estão rodando:

```bash
make health
```

## 🔐 Autenticação

### Tokens Automáticos

A collection está configurada para capturar automaticamente os tokens JWT:

- **Admin Token**: Capturado no login do admin
- **Cliente Token**: Capturado no login do cliente  
- **Vendedor Token**: Capturado no login do vendedor

### Usuários de Teste

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@revenda.com | admin123 | Admin |
| vendedor@revenda.com | vendedor123 | Vendedor |
| cliente@revenda.com | cliente123 | Cliente |

## 📁 Estrutura da Collection

### 1. Auth Service
- **Health Check**: Verificar status do serviço
- **Login**: Autenticação de usuários
- **Registrar**: Cadastrar novos usuários (Admin)
- **Meus Dados**: Obter dados do usuário logado
- **Listar Usuários**: Listar usuários (Admin)
- **Atualizar Usuário**: Atualizar dados
- **Desativar Usuário**: Desativar usuário (Admin)

### 2. Vehicles Service
- **Health Check**: Verificar status do serviço
- **Listar Veículos**: Listar veículos à venda (Público)
- **Buscar Veículo**: Buscar veículo por ID
- **Criar Veículo**: Criar novo veículo (Vendedor/Admin)
- **Atualizar Veículo**: Atualizar veículo
- **Remover Veículo**: Remover veículo
- **Veículos Vendidos**: Listar veículos vendidos
- **Meus Veículos**: Listar meus veículos

### 3. Orders Service
- **Health Check**: Verificar status do serviço
- **Criar Pedido**: Criar pedido de compra
- **Meus Pedidos**: Listar meus pedidos
- **Pedidos Recebidos**: Listar pedidos recebidos (Vendedor)
- **Buscar Pedido**: Buscar pedido por ID
- **Aprovar Pedido**: Aprovar pedido (Vendedor/Admin)
- **Rejeitar Pedido**: Rejeitar pedido (Vendedor/Admin)
- **Concluir Pedido**: Concluir pedido (Vendedor/Admin)
- **Cancelar Pedido**: Cancelar pedido (Cliente/Admin)

### 4. Fluxos de Teste
- **Fluxo Completo de Compra**: Cenário completo de compra
- **Fluxo de Gerenciamento**: Cenário de gerenciamento de veículos

## 🔄 Fluxos de Teste

### Fluxo Completo de Compra

1. **Login Cliente** → Captura token do cliente
2. **Listar Veículos** → Seleciona primeiro veículo disponível
3. **Criar Pedido** → Cria pedido de compra
4. **Login Vendedor** → Captura token do vendedor
5. **Aprovar Pedido** → Vendedor aprova o pedido

### Fluxo de Gerenciamento de Veículos

1. **Login Vendedor** → Captura token do vendedor
2. **Criar Veículo** → Cria novo veículo
3. **Listar Meus Veículos** → Verifica veículos criados
4. **Atualizar Veículo** → Atualiza dados do veículo

## 🧪 Como Testar

### 1. Teste Individual

1. **Selecione um endpoint** na collection
2. **Verifique os parâmetros** (URL, headers, body)
3. **Clique em "Send"**
4. **Verifique a resposta**

### 2. Teste de Fluxo

1. **Abra um fluxo** na pasta "Fluxos de Teste"
2. **Execute os requests em sequência**
3. **Verifique os logs** no console do Postman
4. **Confirme que as variáveis** foram definidas

### 3. Teste de Autenticação

1. **Execute o login** do perfil desejado
2. **Verifique se o token** foi capturado
3. **Execute endpoints protegidos**
4. **Confirme as permissões**

## 📊 Variáveis de Ambiente

### URLs Base
- `auth_base_url`: http://localhost:3001
- `vehicles_base_url`: http://localhost:3002
- `orders_base_url`: http://localhost:3003

### Tokens (Automáticos)
- `auth_token`: Token do admin
- `cliente_token`: Token do cliente
- `vendedor_token`: Token do vendedor

### IDs (Automáticos)
- `user_id`: ID do usuário logado
- `vehicle_id`: ID do veículo criado/selecionado
- `order_id`: ID do pedido criado
- `user_perfil`: Perfil do usuário logado

## 🔍 Troubleshooting

### Problema: Token não capturado
```javascript
// Verifique se o script de teste está correto
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set('auth_token', response.token);
}
```

### Problema: Variável não definida
1. **Verifique o Environment** selecionado
2. **Execute o request** que define a variável
3. **Verifique os logs** no console

### Problema: Erro 401/403
1. **Execute o login** novamente
2. **Verifique se o token** está correto
3. **Confirme as permissões** do usuário

### Problema: Erro 404
1. **Verifique se os serviços** estão rodando
2. **Confirme as URLs** no environment
3. **Verifique o endpoint** correto

## 📝 Exemplos de Uso

### Teste de Login
```bash
# 1. Execute "Login" no Auth Service
# 2. Verifique a resposta:
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "6878d446cfa619d4b29fde6c",
    "nome": "Administrador Sistema",
    "email": "admin@revenda.com",
    "perfil": "Admin"
  }
}
```

### Teste de Criação de Veículo
```bash
# 1. Execute "Login Vendedor"
# 2. Execute "Criar Veículo"
# 3. Verifique se vehicle_id foi definido
# 4. Execute "Meus Veículos" para confirmar
```

### Teste de Fluxo Completo
```bash
# 1. Execute "Fluxo Completo de Compra"
# 2. Verifique os logs no console
# 3. Confirme que todas as variáveis foram definidas
# 4. Verifique o status final do pedido
```

## 🎯 Dicas de Uso

### 1. Use os Fluxos Pré-configurados
- Os fluxos já estão organizados em sequência lógica
- Execute um fluxo completo para testar cenários reais

### 2. Monitore as Variáveis
- Abra o painel de variáveis para acompanhar mudanças
- Use o console para ver logs detalhados

### 3. Teste Diferentes Perfis
- Teste com Admin, Vendedor e Cliente
- Verifique as permissões de cada perfil

### 4. Use Filtros e Paginação
- Teste diferentes parâmetros de busca
- Verifique a paginação dos resultados

### 5. Valide Respostas
- Verifique códigos de status HTTP
- Confirme estrutura das respostas JSON
- Valide regras de negócio

## 🔧 Personalização

### Adicionar Novos Endpoints
1. **Crie uma nova pasta** na collection
2. **Configure URL, método e headers**
3. **Adicione scripts de teste** se necessário
4. **Documente o endpoint**

### Modificar Environment
1. **Edite as variáveis** no environment
2. **Adicione novas variáveis** conforme necessário
3. **Configure diferentes ambientes** (dev, staging, prod)

### Criar Novos Fluxos
1. **Crie uma nova pasta** em "Fluxos de Teste"
2. **Organize os requests** em sequência lógica
3. **Adicione scripts** para capturar variáveis
4. **Documente o fluxo**

## 📚 Referências

- [Documentação da API](API.md)
- [Guia de Instalação](../INSTALACAO.md)
- [Documentação do Makefile](MAKEFILE.md)

## 🆘 Suporte

Para problemas com a collection:

1. **Verifique se os serviços estão rodando**
2. **Confirme o environment selecionado**
3. **Execute os fluxos em sequência**
4. **Verifique os logs no console**
5. **Consulte a documentação da API** 