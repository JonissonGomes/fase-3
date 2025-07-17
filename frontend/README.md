# Frontend - Revenda de Veículos

## 🚀 Visão Geral

Este diretório contém o frontend da aplicação de revenda de veículos, que será hospedado na Vercel.

## 📋 Tecnologias Recomendadas

### Opção 1: React + Vite (Recomendado)
```bash
# Criar projeto React com Vite
npm create vite@latest . -- --template react
npm install

# Dependências recomendadas
npm install axios react-router-dom @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
```

### Opção 2: Next.js
```bash
# Criar projeto Next.js
npx create-next-app@latest . --typescript --tailwind --eslint
npm install axios @tanstack/react-query
```

### Opção 3: Vue.js
```bash
# Criar projeto Vue
npm create vue@latest .
npm install

# Dependências recomendadas
npm install axios vue-router pinia
```

## 🔧 Configuração

### 1. Estrutura de Diretórios
```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── VehicleCard.jsx
│   │   └── LoginForm.jsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Vehicles.jsx
│   │   ├── Orders.jsx
│   │   └── Admin.jsx
│   ├── services/           # Serviços de API
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── vehicles.js
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js
│   │   └── useVehicles.js
│   ├── context/            # Context API
│   │   └── AuthContext.jsx
│   ├── utils/              # Utilitários
│   │   └── helpers.js
│   └── App.jsx
├── public/                 # Arquivos estáticos
├── package.json
├── vite.config.js          # ou next.config.js
├── vercel.json             # Configuração da Vercel
└── tailwind.config.js      # Configuração do Tailwind
```

### 2. Configuração das APIs

```javascript
// src/services/api.js
const API_BASE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'https://revenda-auth-service.onrender.com',
  vehicles: import.meta.env.VITE_VEHICLES_SERVICE_URL || 'https://revenda-vehicles-service.onrender.com',
  orders: import.meta.env.VITE_ORDERS_SERVICE_URL || 'https://revenda-orders-service.onrender.com'
};

export const api = {
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URLS.auth}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return response.json();
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URLS.auth}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    }
  },
  vehicles: {
    list: async (token) => {
      const response = await fetch(`${API_BASE_URLS.vehicles}/vehicles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    create: async (vehicleData, token) => {
      const response = await fetch(`${API_BASE_URLS.vehicles}/vehicles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });
      return response.json();
    }
  },
  orders: {
    list: async (token) => {
      const response = await fetch(`${API_BASE_URLS.orders}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    create: async (orderData, token) => {
      const response = await fetch(`${API_BASE_URLS.orders}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      return response.json();
    }
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
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Variáveis de Ambiente

```bash
# .env.local (desenvolvimento)
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_VEHICLES_SERVICE_URL=http://localhost:3002
VITE_ORDERS_SERVICE_URL=http://localhost:3003

# .env.production (produção)
VITE_AUTH_SERVICE_URL=https://revenda-auth-service.onrender.com
VITE_VEHICLES_SERVICE_URL=https://revenda-vehicles-service.onrender.com
VITE_ORDERS_SERVICE_URL=https://revenda-orders-service.onrender.com
```

## 🚀 Deploy

### 1. Preparar para Deploy
```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Testar build localmente
npm run preview
```

### 2. Deploy na Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### 3. Deploy Automático
1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente no dashboard
3. Cada push no GitHub fará deploy automático

## 🧪 Testando

### 1. Desenvolvimento Local
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Testar com backend local
# Certifique-se de que os microserviços estão rodando
```

### 2. Testar APIs
```bash
# Testar login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@revenda.com", "senha": "admin123"}'
```

### 3. Testar Frontend
- Acesse http://localhost:5173 (Vite) ou http://localhost:3000 (Next.js)
- Teste login com usuários de exemplo
- Teste funcionalidades principais

## 📱 Funcionalidades

### Páginas Principais
- **Home**: Página inicial com veículos em destaque
- **Login/Register**: Autenticação de usuários
- **Vehicles**: Lista e detalhes de veículos
- **Orders**: Histórico de pedidos
- **Admin**: Painel administrativo (apenas Admin)

### Perfis de Usuário
- **Cliente**: Visualizar e comprar veículos
- **Vendedor**: Cadastrar e gerenciar veículos
- **Admin**: Acesso total ao sistema

## 🔐 Autenticação

### Context API
```javascript
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      if (response.token) {
        setToken(response.token);
        setUser(response.usuario);
        localStorage.setItem('token', response.token);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## 🎨 Styling

### Tailwind CSS
```bash
# Instalar Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      }
    },
  },
  plugins: [],
}
```

## 📊 Performance

### Otimizações
- **Code Splitting**: Carregamento sob demanda
- **Lazy Loading**: Componentes carregados quando necessário
- **Image Optimization**: Otimização automática de imagens
- **Caching**: Cache inteligente da Vercel

### Métricas
- **Lighthouse Score**: Performance, SEO, Accessibility
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Analysis**: Tamanho dos arquivos

## 🔄 CI/CD

### GitHub Actions
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

## 📞 Suporte

### Documentação
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Vue.js](https://vuejs.org/)
- [Vercel](https://vercel.com/docs)

### Projeto
- [Backend Documentation](../docs/DEPLOY_RENDER.md)
- [API Documentation](../docs/API.md)
- [Postman Collection](../docs/Revenda_Veiculos_API.postman_collection.json) 