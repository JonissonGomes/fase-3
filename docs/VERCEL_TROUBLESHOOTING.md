# Troubleshooting - Deploy Vercel

Este guia ajuda a resolver problemas comuns durante o deploy do frontend na Vercel.

## Problemas Comuns e Soluções

### 1. Erro: "No Output Directory named 'public' found"

**Sintoma:**
```
Error: No Output Directory named "public" found after the Build completed.
```

**Causa:** O Vercel está procurando por um diretório chamado "public" em vez do "dist" gerado pelo Vite.

**Solução:**
1. Verifique se o `vercel.json` está configurado corretamente:
   ```json
   {
     "outputDirectory": "frontend/dist"
   }
   ```

2. No painel do Vercel, vá em **Settings > Build & Output** e configure:
   - **Output Directory:** `frontend/dist`

3. Se o problema persistir, verifique se o build está gerando o diretório `dist`:
   ```bash
   cd frontend
   npm run build
   ls -la dist/
   ```

### 2. Erro: "Function Runtimes must have a valid version"

**Sintoma:**
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

**Causa:** Configuração incorreta de `functions` no `vercel.json` para projetos estáticos.

**Solução:**
Remova a seção `functions` do `vercel.json` para projetos SPA:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Erro: "npm error Exit handler never called!"

**Sintoma:**
```
npm error Exit handler never called!
npm error This is an error with npm itself.
Error: Command "cd frontend && npm install" exited with 1
```

**Causa:** Problema com versão do Node.js ou configuração do npm.

**Soluções:**

#### Solução 1: Especificar versão do Node.js
1. Crie um arquivo `.nvmrc` no diretório `frontend`:
   ```
   18
   ```

2. Adicione `engines` no `package.json`:
   ```json
   {
     "engines": {
       "node": ">=18.0.0",
       "npm": ">=8.0.0"
     }
   }
   ```

#### Solução 2: Configurar no painel do Vercel
1. Acesse **Settings > General**
2. Em **Node.js Version**, selecione **18.x**

#### Solução 3: Limpar cache
1. No painel do Vercel, vá em **Settings > General**
2. Clique em **Clear Build Cache**

### 3. Erro: "Module not found"

**Sintoma:**
```
Module not found: Can't resolve 'react' in '/vercel/path0/frontend/src'
```

**Causa:** Dependências não instaladas corretamente.

**Solução:**
1. Verifique se o `package.json` está na raiz do projeto ou no diretório correto
2. Certifique-se de que o `installCommand` está correto no `vercel.json`:
   ```json
   {
     "installCommand": "cd frontend && npm install"
   }
   ```

### 4. Erro: "Build command failed"

**Sintoma:**
```
Build command failed
```

**Causa:** Comando de build incorreto ou dependências faltando.

**Solução:**
1. Verifique se o `buildCommand` está correto:
   ```json
   {
     "buildCommand": "cd frontend && npm run build"
   }
   ```

2. Teste o build localmente:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### 5. Erro: "Environment variables not found"

**Sintoma:**
```
VITE_AUTH_SERVICE_URL is not defined
```

**Causa:** Variáveis de ambiente não configuradas.

**Solução:**
1. No painel do Vercel, vá em **Settings > Environment Variables**
2. Adicione as variáveis:
   ```
   VITE_AUTH_SERVICE_URL = https://fase-3-auth-service.onrender.com
   VITE_VEHICLES_SERVICE_URL = https://fase-3-vehicles-service.onrender.com
   VITE_ORDERS_SERVICE_URL = https://fase-3-orders-service.onrender.com
   ```

## Configuração Recomendada

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_AUTH_SERVICE_URL": "https://fase-3-auth-service.onrender.com",
    "VITE_VEHICLES_SERVICE_URL": "https://fase-3-vehicles-service.onrender.com",
    "VITE_ORDERS_SERVICE_URL": "https://fase-3-orders-service.onrender.com"
  }
}
```

**⚠️ Importante:** Para projetos SPA (Single Page Application), **NÃO** inclua a seção `functions` no `vercel.json`.

### .vercelignore
```
# Backend files
backend/
auth-service/
vehicles-service/
orders-service/

# Documentation
*.md
!frontend/README.md

# Development files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependency directories
node_modules/

# IDE files
.vscode/
.idea/
```

## Comandos Úteis

### Build Local
```bash
# Limpar e reinstalar
cd frontend
rm -rf node_modules dist package-lock.json
npm install
npm run build

# Verificar se o build foi bem-sucedido
ls -la dist/
```

### Deploy Manual
```bash
# Usando o script
./scripts/deploy-vercel.sh

# Usando Vercel CLI
vercel --prod
```

### Verificar Logs
```bash
# Logs do build
vercel logs

# Logs de uma função específica
vercel logs --function=index
```

## Monitoramento

### Health Check
Após o deploy, verifique se a aplicação está funcionando:
```bash
curl https://seu-projeto.vercel.app
```

### Variáveis de Ambiente
Verifique se as variáveis estão sendo carregadas:
```javascript
console.log('Environment variables:', {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL,
  vehicles: import.meta.env.VITE_VEHICLES_SERVICE_URL,
  orders: import.meta.env.VITE_ORDERS_SERVICE_URL
});
```

## Contato

Se os problemas persistirem:
1. Verifique os logs completos no painel do Vercel
2. Teste o build localmente primeiro
3. Consulte a [documentação oficial do Vercel](https://vercel.com/docs)
4. Abra uma issue no repositório com os logs de erro 