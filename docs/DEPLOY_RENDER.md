# Deploy no Render com MongoDB Atlas

## 🚀 Visão Geral

Este guia mostra como fazer deploy dos microserviços backend no Render usando MongoDB Atlas como banco de dados, mantendo a estrutura de monorepo. O frontend será hospedado separadamente na Vercel.

## 📋 Pré-requisitos

1. **Conta no Render** (gratuita): [render.com](https://render.com)
2. **Conta no MongoDB Atlas** (gratuita): [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Repositório no GitHub** com o código
4. **Docker** (opcional, para testes locais)

## 🔧 Configuração do MongoDB Atlas

### 1. Criar Cluster no MongoDB Atlas

1. Acesse [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster (Free Tier)
4. Configure o acesso de rede (0.0.0.0/0 para desenvolvimento)
5. Crie um usuário de banco de dados

### 2. Obter String de Conexão

```bash
# Exemplo de string de conexão
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 3. Criar Bancos de Dados

No MongoDB Atlas, crie os seguintes bancos:
- `auth_service`
- `vehicles_service`
- `orders_service`

## 🎯 Deploy no Render

### Opção 1: Deploy Automatizado (Recomendado)

#### 1. Preparar o Repositório

```bash
# Adicionar o arquivo render.yaml ao repositório
git add render.yaml
git commit -m "Add Render configuration"
git push origin main
```

#### 2. Conectar ao Render

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. O Render detectará automaticamente o `render.yaml`

#### 3. Configurar Variáveis

O Render usará as configurações do `render.yaml`, mas você pode ajustar:

- **JWT_SECRET**: Será gerado automaticamente
- **MONGODB_URI**: Use a string do MongoDB Atlas
- **FRONTEND_URL**: URL do frontend na Vercel (ex: https://revenda-veiculos.vercel.app)

### Opção 2: Deploy Manual

#### 1. Auth Service

1. **New Web Service** → Conecte o repositório
2. **Root Directory**: `services/auth-service`
3. **Build Command**: `npm ci --only=production`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=sua_chave_jwt_super_secreta
   MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority
       FRONTEND_URL=https://revenda-veiculos.vercel.app
    LOG_LEVEL=info
  ```

#### 2. Vehicles Service

1. **New Web Service** → Conecte o repositório
2. **Root Directory**: `services/vehicles-service`
3. **Build Command**: `npm ci --only=production`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=sua_chave_jwt_super_secreta
   MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/vehicles_service?retryWrites=true&w=majority
   FRONTEND_URL=https://revenda-veiculos.vercel.app
   LOG_LEVEL=info
   ```

#### 3. Orders Service

1. **New Web Service** → Conecte o repositório
2. **Root Directory**: `services/orders-service`
3. **Build Command**: `npm ci --only=production`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=sua_chave_jwt_super_secreta
   MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/orders_service?retryWrites=true&w=majority
   VEHICLES_SERVICE_URL=https://revenda-vehicles-service.onrender.com
   FRONTEND_URL=https://revenda-veiculos.vercel.app
   LOG_LEVEL=info
   ```

## 🔗 URLs dos Serviços

Após o deploy, você terá URLs como:
- **Auth Service**: `https://revenda-auth-service.onrender.com`
- **Vehicles Service**: `https://revenda-vehicles-service.onrender.com`
- **Orders Service**: `https://revenda-orders-service.onrender.com`

## 🧪 Testando o Deploy

### 1. Health Checks

```bash
# Testar cada serviço
curl https://revenda-auth-service.onrender.com/health
curl https://revenda-vehicles-service.onrender.com/health
curl https://revenda-orders-service.onrender.com/health
```

### 2. Login de Teste

```bash
# Fazer login
curl -X POST https://revenda-auth-service.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@revenda.com", "senha": "admin123"}'
```

### 3. Listar Veículos

```bash
# Listar veículos (com token)
curl https://revenda-vehicles-service.onrender.com/vehicles \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔄 Deploy Automático

### GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Build Fails
```bash
# Verificar logs no Render Dashboard
# Verificar se todas as dependências estão no package.json
```

#### 2. Connection Timeout
```bash
# Verificar se o MongoDB Atlas está acessível
# Verificar se as credenciais estão corretas
```

#### 3. CORS Errors
```bash
# Verificar se FRONTEND_URL está configurado
# Verificar se o CORS está configurado nos serviços
```

### Logs e Monitoramento

1. **Render Dashboard**: Acesse os logs de cada serviço
2. **MongoDB Atlas**: Monitore as conexões e queries
3. **Health Checks**: Configure alertas para downtime

## 📊 Monitoramento

### Métricas Importantes

- **Uptime**: Render fornece métricas de uptime
- **Response Time**: Monitore a latência das APIs
- **Database Connections**: MongoDB Atlas mostra conexões ativas
- **Error Rate**: Monitore logs de erro

### Alertas

Configure alertas para:
- Serviços offline
- High response time
- Database connection errors
- Memory/CPU usage

## 🔐 Segurança

### Variáveis de Ambiente

- ✅ **JWT_SECRET**: Use uma chave forte e única
- ✅ **MONGODB_URI**: Use credenciais específicas para produção
- ✅ **NODE_ENV**: Sempre `production`

### CORS

Configure CORS adequadamente para permitir requisições do frontend na Vercel:
```javascript
// Nos serviços
app.use(cors({
  origin: [
    'https://revenda-veiculos.vercel.app',
    'https://revenda-veiculos-git-main-seu-usuario.vercel.app',
    'http://localhost:3000' // desenvolvimento
  ],
  credentials: true
}));
```

## 🚀 Próximos Passos

### 1. Domínio Personalizado
- Configure um domínio próprio
- Use Cloudflare para SSL gratuito
- Configure DNS para apontar para o Render

### 2. API Gateway
- Implemente um gateway para unificar endpoints
- Use Nginx ou Express Gateway
- Configure rate limiting

### 3. Cache
- Implemente Redis para cache
- Use MongoDB Atlas para cache de sessões
- Configure cache de queries

### 4. Backup
- Configure backup automático no MongoDB Atlas
- Implemente backup dos dados críticos
- Teste restauração regularmente

## 📞 Suporte

### Render
- [Documentação Render](https://render.com/docs)
- [Community Forum](https://community.render.com)

### MongoDB Atlas
- [Documentação MongoDB Atlas](https://docs.atlas.mongodb.com)
- [Support Center](https://support.mongodb.com)

### Projeto
- [Issues no GitHub](https://github.com/seu-usuario/revenda-veiculos/issues)
- [Documentação do Projeto](docs/) 