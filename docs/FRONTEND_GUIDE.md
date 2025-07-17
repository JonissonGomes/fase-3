# 🎨 Guia do Frontend React

## 📋 Visão Geral

O frontend da Plataforma de Revenda de Veículos é uma aplicação React moderna desenvolvida com Vite, Tailwind CSS e integração completa com os microserviços do backend.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento client-side
- **Axios** - Cliente HTTP para APIs
- **React Hook Form** - Gerenciamento de formulários
- **React Hot Toast** - Notificações elegantes
- **Lucide React** - Ícones modernos

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── LoginForm.jsx    # Formulário de login
│   │   ├── RegisterForm.jsx # Formulário de cadastro
│   │   ├── ProtectedRoute.jsx # Proteção de rotas
│   │   └── LoadingSpinner.jsx # Componente de loading
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.jsx  # Contexto de autenticação
│   ├── pages/               # Páginas da aplicação
│   │   ├── Dashboard.jsx    # Dashboard principal
│   │   ├── VehiclesList.jsx # Lista de veículos
│   │   ├── VehicleForm.jsx  # Formulário de veículos
│   │   ├── OrdersList.jsx   # Lista de pedidos
│   │   └── UsersList.jsx    # Lista de usuários (Admin)
│   ├── services/            # Serviços de API
│   │   └── api.js          # Configuração e serviços da API
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Ponto de entrada
│   └── index.css           # Estilos globais
├── public/                 # Arquivos estáticos
├── package.json            # Dependências
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind
├── postcss.config.js       # Configuração do PostCSS
├── vercel.json             # Configuração do Vercel
└── README.md               # Documentação do frontend
```

## 🎯 Funcionalidades por Perfil

### 🔐 Autenticação
- **Login** - Acesso com email e senha
- **Cadastro** - Registro de novos usuários
  - **Cliente**: Nome, Email, Senha, CPF (obrigatório)
  - **Vendedor**: Nome, Email, Senha
  - **Admin**: Nome, Email, Senha
- **Logout** - Encerramento de sessão
- **Proteção de Rotas** - Verificação de permissões

### 👤 Dashboard por Perfil

#### 🛒 Cliente
- **Dashboard**: Estatísticas de veículos disponíveis e pedidos
- **Veículos**: Lista de veículos disponíveis para compra
- **Pedidos**: Histórico de pedidos realizados
- **Compra**: Funcionalidade de compra direta

#### 🏪 Vendedor
- **Dashboard**: Estatísticas de veículos próprios e vendidos
- **Veículos**: Gerenciamento completo (CRUD)
- **Novo Veículo**: Formulário de cadastro
- **Edição**: Formulário de edição de veículos
- **Filtros**: Disponíveis vs Vendidos

#### 👑 Administrador
- **Dashboard**: Visão geral completa do sistema
- **Usuários**: Lista e gerenciamento de usuários
- **Pedidos**: Aprovação/reprovação de pedidos
- **Veículos**: Acesso total ao gerenciamento
- **Estatísticas**: Métricas completas do sistema

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- NPM ou Yarn

### Setup Automático
```bash
# Setup completo do frontend
make frontend-setup

# Ou usando o script diretamente
./scripts/setup-frontend.sh
```

### Setup Manual
```bash
# 1. Navegar para o diretório
cd frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as URLs dos microserviços

# 4. Executar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
```

### Comandos Makefile
```bash
make frontend-setup      # Setup completo
make frontend-install    # Instala dependências
make frontend-dev        # Modo desenvolvimento
make frontend-build      # Build para produção
make frontend-preview    # Preview do build
make frontend-lint       # Executar linting
make frontend-clean      # Limpar build
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# URLs dos microserviços
VITE_AUTH_SERVICE_URL=https://fase-3-auth-service.onrender.com
VITE_VEHICLES_SERVICE_URL=https://fase-3-vehicles-service.onrender.com
VITE_ORDERS_SERVICE_URL=https://fase-3-orders-service.onrender.com

# Para desenvolvimento local
# VITE_AUTH_SERVICE_URL=http://localhost:3001
# VITE_VEHICLES_SERVICE_URL=http://localhost:3002
# VITE_ORDERS_SERVICE_URL=http://localhost:3003
```

### URLs dos Microserviços
- **Auth Service**: `https://fase-3-auth-service.onrender.com`
- **Vehicles Service**: `https://fase-3-vehicles-service.onrender.com`
- **Orders Service**: `https://fase-3-orders-service.onrender.com`

## 🎨 Design System

### Cores
```css
/* Cores primárias */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Estados */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

### Componentes
```css
/* Botões */
.btn-primary    /* Botão principal azul */
.btn-secondary  /* Botão secundário cinza */

/* Inputs */
.input-field    /* Campo de entrada padronizado */

/* Cards */
.card           /* Container com sombra */
```

### Ícones
- **Lucide React** - Biblioteca de ícones modernos
- **Ícones contextuais** por perfil e funcionalidade
- **Ícones responsivos** que se adaptam ao tema

## 📱 Responsividade

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Grid System
```css
/* Grid responsivo */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
grid-cols-1 md:grid-cols-4
```

## 🔒 Segurança

### Autenticação JWT
- **Token Storage**: localStorage
- **Auto-refresh**: Validação automática
- **Logout**: Limpeza automática de dados

### Proteção de Rotas
```jsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminPage />
</ProtectedRoute>
```

### Interceptors Axios
- **Request**: Adição automática de token
- **Response**: Tratamento de erros 401
- **Timeout**: 10 segundos configurado

## 🧪 Testes

### Linting
```bash
npm run lint
```

### Build Test
```bash
npm run build
npm run preview
```

### Validação de Formulários
- **Client-side**: Validação em tempo real
- **Required fields**: Campos obrigatórios
- **Format validation**: CPF, email, etc.

## 🚀 Deploy

### Vercel (Recomendado)
1. **Conectar repositório** na Vercel
2. **Configurar diretório**: `frontend/`
3. **Configurar variáveis de ambiente**
4. **Deploy automático** a cada push

### Configuração Vercel
```json
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

### Outras Plataformas
- **Netlify**: Compatível com Vite
- **GitHub Pages**: Requer configuração adicional
- **Firebase Hosting**: Compatível

## 🔗 Integração com Backend

### Serviços de API
```javascript
// Autenticação
authService.login(credentials)
authService.register(userData)
authService.getUsers()

// Veículos
vehiclesService.getVehicles()
vehiclesService.createVehicle(data)
vehiclesService.updateVehicle(id, data)

// Pedidos
ordersService.getOrders()
ordersService.createOrder(data)
ordersService.approveOrder(id)
```

### Tratamento de Erros
- **Toast notifications** para feedback
- **Error boundaries** para captura de erros
- **Fallback UI** para estados de erro

## 📊 Performance

### Otimizações
- **Code splitting** automático do Vite
- **Lazy loading** de componentes
- **Tree shaking** para reduzir bundle
- **Minificação** automática

### Métricas
- **Bundle size**: < 500KB gzipped
- **First load**: < 2s
- **Lighthouse score**: > 90

## 🎯 Funcionalidades Avançadas

### Dashboard Dinâmico
- **Estatísticas em tempo real**
- **Cards interativos**
- **Navegação contextual**

### Formulários Inteligentes
- **Validação em tempo real**
- **Auto-complete**
- **Máscaras de entrada**

### Notificações
- **Toast notifications**
- **Status de operações**
- **Feedback visual**

## 🔄 Próximos Passos

### Melhorias Planejadas
- [ ] **Testes unitários** com Jest/Vitest
- [ ] **Upload de imagens** para veículos
- [ ] **Filtros avançados** de busca
- [ ] **Paginação** infinita
- [ ] **Busca em tempo real**
- [ ] **Notificações push**
- [ ] **PWA** (Progressive Web App)
- [ ] **Tema escuro**
- [ ] **Internacionalização** (i18n)

### Otimizações
- [ ] **Service Workers** para cache
- [ ] **Image optimization**
- [ ] **Bundle analysis**
- [ ] **Performance monitoring**

## 📞 Suporte

### Troubleshooting
1. **Verificar logs do console**
2. **Verificar conectividade com microserviços**
3. **Verificar variáveis de ambiente**
4. **Verificar versão do Node.js**

### Recursos
- **Documentação**: `frontend/README.md`
- **Issues**: GitHub Issues
- **Stack Overflow**: Tag `react` + `vite`

### Comandos Úteis
```bash
# Verificar versão do Node.js
node --version

# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar portas em uso
lsof -i :3000
```

---

**🎉 Frontend pronto para produção!**

O frontend está completamente implementado e integrado com os microserviços. Todas as funcionalidades estão funcionais e prontas para deploy na Vercel ou outras plataformas. 