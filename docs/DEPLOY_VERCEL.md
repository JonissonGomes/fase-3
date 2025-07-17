# Deploy do Frontend na Vercel

## 🚀 Visão Geral

Este guia mostra como fazer deploy do frontend na Vercel, mantendo os microserviços backend no Render.

## 📋 Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (Render)      │◄──►│   (MongoDB      │
│                 │    │                 │    │    Atlas)       │
│ - React/Vue     │    │ - Auth Service  │    │                 │
│ - Static Files  │    │ - Vehicles Svc  │    │                 │
│ - CDN Global    │    │ - Orders Svc    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Pré-requisitos

1. **Conta na Vercel** (gratuita): [vercel.com](https://vercel.com)
2. **Repositório no GitHub** com o frontend
3. **Backend já deployado** no Render
4. **Node.js** instalado localmente

## 🔧 Configuração do Frontend

### 1. Estrutura do Frontend

```bash
frontend/
├── package.json
├── vite.config.js          # ou next.config.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   ├── api.js          # Configuração das APIs
│   │   └── auth.js         # Autenticação
│   └── App.jsx
├── public/
└── vercel.json             # Configuração da Vercel
```

### 2. Configuração das APIs

```javascript
// src/services/api.js
const API_BASE_URLS = {
  auth: process.env.REACT_APP_AUTH_SERVICE_URL || 'https://revenda-auth-service.onrender.com',
  vehicles: process.env.REACT_APP_VEHICLES_SERVICE_URL || 'https://revenda-vehicles-service.onrender.com',
  orders: process.env.REACT_APP_ORDERS_SERVICE_URL || 'https://revenda-orders-service.onrender.com'
};

export const api = {
  auth: {
    login: (credentials) => fetch(`${API_BASE_URLS.auth}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
    register: (userData) => fetch(`${API_BASE_URLS.auth}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
  },
  vehicles: {
    list: (token) => fetch(`${API_BASE_URLS.vehicles}/vehicles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    create: (vehicleData, token) => fetch(`${API_BASE_URLS.vehicles}/vehicles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicleData)
    })
  },
  orders: {
    list: (token) => fetch(`${API_BASE_URLS.orders}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    create: (orderData, token) => fetch(`${API_BASE_URLS.orders}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    })
  }
};
```

### 3. Configuração da Vercel

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_AUTH_SERVICE_URL": "https://revenda-auth-service.onrender.com",
    "REACT_APP_VEHICLES_SERVICE_URL": "https://revenda-vehicles-service.onrender.com",
    "REACT_APP_ORDERS_SERVICE_URL": "https://revenda-orders-service.onrender.com"
  }
}
```

### 4. Variáveis de Ambiente

```bash
# .env.local (desenvolvimento)
REACT_APP_AUTH_SERVICE_URL=http://localhost:3001
REACT_APP_VEHICLES_SERVICE_URL=http://localhost:3002
REACT_APP_ORDERS_SERVICE_URL=http://localhost:3003

# .env.production (produção)
REACT_APP_AUTH_SERVICE_URL=https://revenda-auth-service.onrender.com
REACT_APP_VEHICLES_SERVICE_URL=https://revenda-vehicles-service.onrender.com
REACT_APP_ORDERS_SERVICE_URL=https://revenda-orders-service.onrender.com
```

## 🚀 Deploy na Vercel

### Opção 1: Deploy via Dashboard

1. **Acesse [vercel.com](https://vercel.com)**
2. **Clique em "New Project"**
3. **Conecte seu repositório GitHub**
4. **Configure o projeto**:
   - **Framework Preset**: Vite/React/Next.js
   - **Root Directory**: `frontend` (se estiver em subdiretório)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (ou `build` para Create React App)

### Opção 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
cd frontend
vercel

# Deploy em produção
vercel --prod
```

### Opção 3: Deploy Automático

1. **Conecte o repositório na Vercel**
2. **Configure as variáveis de ambiente**:
   ```
   REACT_APP_AUTH_SERVICE_URL=https://revenda-auth-service.onrender.com
   REACT_APP_VEHICLES_SERVICE_URL=https://revenda-vehicles-service.onrender.com
   REACT_APP_ORDERS_SERVICE_URL=https://revenda-orders-service.onrender.com
   ```
3. **Cada push no GitHub fará deploy automático**

## 🔗 URLs e Domínios

### URLs Padrão
- **Desenvolvimento**: `https://revenda-veiculos-git-main-seu-usuario.vercel.app`
- **Produção**: `https://revenda-veiculos.vercel.app`

### Domínio Personalizado
1. **Compre um domínio** (ex: `revenda-veiculos.com`)
2. **Configure DNS** para apontar para a Vercel
3. **Adicione o domínio** no dashboard da Vercel

## 🧪 Testando o Deploy

### 1. Verificar Build
```bash
# Verificar se o build está funcionando
npm run build
```

### 2. Testar APIs
```bash
# Testar se as APIs estão acessíveis
curl https://revenda-auth-service.onrender.com/health
curl https://revenda-vehicles-service.onrender.com/health
curl https://revenda-orders-service.onrender.com/health
```

### 3. Testar Frontend
- Acesse a URL do frontend
- Teste login: `admin@revenda.com` / `admin123`
- Teste funcionalidades principais

## 🔧 Configurações Avançadas

### 1. CORS no Backend

Certifique-se de que o CORS está configurado nos microserviços:

```javascript
// Nos serviços backend
app.use(cors({
  origin: [
    'https://revenda-veiculos.vercel.app',
    'https://revenda-veiculos-git-main-seu-usuario.vercel.app',
    'http://localhost:3000' // desenvolvimento
  ],
  credentials: true
}));
```

### 2. Environment Variables na Vercel

No dashboard da Vercel:
1. **Settings** → **Environment Variables**
2. **Adicione as variáveis**:
   ```
   REACT_APP_AUTH_SERVICE_URL=https://revenda-auth-service.onrender.com
   REACT_APP_VEHICLES_SERVICE_URL=https://revenda-vehicles-service.onrender.com
   REACT_APP_ORDERS_SERVICE_URL=https://revenda-orders-service.onrender.com
   ```

### 3. Preview Deployments

A Vercel cria automaticamente:
- **Preview deployments** para cada PR
- **Production deployment** para o branch main
- **Rollback** automático em caso de erro

## 📊 Monitoramento

### Vercel Analytics
- **Performance**: Core Web Vitals
- **Analytics**: Page views, users
- **Functions**: Serverless function logs

### Integração com Backend
- **Health checks** regulares
- **Error tracking** (Sentry, LogRocket)
- **Performance monitoring**

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. CORS Errors
```bash
# Verificar se o CORS está configurado no backend
# Verificar se as URLs estão corretas
```

#### 2. Build Fails
```bash
# Verificar dependências
npm install

# Verificar scripts no package.json
npm run build
```

#### 3. Environment Variables
```bash
# Verificar se as variáveis estão configuradas na Vercel
# Verificar se começam com REACT_APP_
```

### Logs e Debug

1. **Vercel Dashboard**: Logs de build e runtime
2. **Browser DevTools**: Console e Network
3. **Backend Logs**: Render dashboard

## 🔄 CI/CD

### GitHub Actions (Opcional)

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 📈 Performance

### Otimizações Automáticas
- **CDN Global**: Arquivos estáticos distribuídos
- **Image Optimization**: Otimização automática de imagens
- **Code Splitting**: Carregamento sob demanda
- **Caching**: Cache inteligente

### Métricas
- **Lighthouse Score**: Performance, SEO, Accessibility
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Analysis**: Tamanho dos arquivos

## 🔐 Segurança

### Headers de Segurança
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 📞 Suporte

### Vercel
- [Documentação Vercel](https://vercel.com/docs)
- [Community](https://github.com/vercel/vercel/discussions)

### Projeto
- [Issues no GitHub](https://github.com/seu-usuario/revenda-veiculos/issues)
- [Documentação do Projeto](docs/) 