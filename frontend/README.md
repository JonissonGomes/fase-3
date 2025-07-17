# Frontend - Plataforma de Revenda de Veículos

Frontend React para a plataforma de revenda de veículos, desenvolvido com Vite, Tailwind CSS e integração com microserviços.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

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
└── postcss.config.js       # Configuração do PostCSS
```

## 🎯 Funcionalidades

### 🔐 Autenticação
- **Login** - Acesso com email e senha
- **Cadastro** - Registro de novos usuários
  - Cliente: Nome, Email, Senha, CPF
  - Vendedor: Nome, Email, Senha
  - Admin: Nome, Email, Senha
- **Logout** - Encerramento de sessão

### 👤 Perfis de Usuário

#### 🛒 Cliente
- Visualizar veículos disponíveis
- Comprar veículos
- Acompanhar histórico de pedidos

#### 🏪 Vendedor
- Cadastrar veículos
- Editar veículos
- Excluir veículos
- Visualizar veículos vendidos

#### 👑 Administrador
- Gerenciar usuários
- Aprovar/rejeitar pedidos
- Visualizar todas as vendas
- Acesso total ao sistema

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- NPM ou Yarn

### Instalação

1. **Instalar dependências:**
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente:**
Criar arquivo `.env` na raiz do frontend:
```env
VITE_AUTH_SERVICE_URL=https://fase-3-auth-service.onrender.com
VITE_VEHICLES_SERVICE_URL=https://fase-3-vehicles-service.onrender.com
VITE_ORDERS_SERVICE_URL=https://fase-3-orders-service.onrender.com
```

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

4. **Build para produção:**
```bash
npm run build
```

## 🔧 Configuração

### URLs dos Microserviços
O frontend se conecta aos seguintes microserviços:

- **Auth Service**: `https://fase-3-auth-service.onrender.com`
- **Vehicles Service**: `https://fase-3-vehicles-service.onrender.com`
- **Orders Service**: `https://fase-3-orders-service.onrender.com`

### Variáveis de Ambiente
```env
# URLs dos microserviços (opcional - usa valores padrão se não definido)
VITE_AUTH_SERVICE_URL=https://fase-3-auth-service.onrender.com
VITE_VEHICLES_SERVICE_URL=https://fase-3-vehicles-service.onrender.com
VITE_ORDERS_SERVICE_URL=https://fase-3-orders-service.onrender.com
```

## 🎨 Design System

### Cores
- **Primary**: Azul (#3B82F6)
- **Success**: Verde (#10B981)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)

### Componentes
- **Botões**: `.btn-primary`, `.btn-secondary`
- **Inputs**: `.input-field`
- **Cards**: `.card`

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔒 Segurança

- **Autenticação JWT** - Tokens armazenados no localStorage
- **Proteção de Rotas** - Verificação de permissões por perfil
- **Interceptors Axios** - Adição automática de tokens
- **Validação de Formulários** - Validação client-side

## 🚀 Deploy

### Vercel (Recomendado)
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- **Netlify**: Compatível
- **GitHub Pages**: Requer configuração adicional
- **Firebase Hosting**: Compatível

## 🧪 Testes

```bash
# Executar linting
npm run lint

# Preview build
npm run preview
```

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executar ESLint
```

## 🔗 Integração com Backend

O frontend se integra com os microserviços através do arquivo `src/services/api.js`, que inclui:

- **Interceptors** para autenticação automática
- **Tratamento de erros** centralizado
- **Timeout** configurado
- **Serviços organizados** por domínio

## 🎯 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar upload de imagens para veículos
- [ ] Implementar filtros avançados
- [ ] Adicionar paginação
- [ ] Implementar busca em tempo real
- [ ] Adicionar notificações push
- [ ] Implementar PWA

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console
2. Verificar conectividade com microserviços
3. Verificar variáveis de ambiente
4. Abrir issue no repositório 