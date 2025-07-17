# Guia do Postman para Produção

## 🚀 Configuração para Testar APIs em Produção

### **Opção 1: Usar Environment de Produção (Recomendado)**

1. **Importe a Collection:**
   - Abra o Postman
   - Clique em **"Import"**
   - Selecione: `Revenda_Veiculos_API.postman_collection.json`

2. **Importe o Environment de Produção:**
   - Clique em **"Import"** novamente
   - Selecione: `Revenda_Veiculos_API_Production.postman_environment.json`

3. **Selecione o Environment:**
   - No canto superior direito do Postman
   - Selecione: **"Revenda Veículos - Production"**

4. **Teste as APIs:**
   - Todas as URLs já estarão configuradas para produção
   - Os tokens serão salvos automaticamente

---

### **Opção 2: Usar Variáveis da Collection**

1. **Importe apenas a Collection:**
   - `Revenda_Veiculos_API.postman_collection.json`

2. **Edite as variáveis:**
   - Clique na collection → **"Variables"**
   - Altere as URLs para produção:
     ```
     auth_base_url: https://fase-3-auth-service.onrender.com
     vehicles_base_url: https://fase-3-vehicles-service.onrender.com
     orders_base_url: https://fase-3-orders-service.onrender.com
     ```

---

## 🧪 Testes Recomendados

### **1. Health Check (Primeiro teste)**
```
GET {{auth_base_url}}/health
```
**Resposta esperada:**
```json
{
  "status": "OK",
  "service": "auth-service",
  "timestamp": "2025-07-17T12:15:00.000Z",
  "uptime": 123.456
}
```

### **2. Login de Teste**
```
POST {{auth_base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@revenda.com",
  "senha": "admin123"
}
```

### **3. Fluxo Completo**
1. **Login** → Salva token automaticamente
2. **Criar Veículo** → Usa token do vendedor
3. **Listar Veículos** → Verifica se foi criado
4. **Criar Pedido** → Usa token do cliente

---

## 🔧 Configurações Importantes

### **URLs de Produção:**
- **Auth Service:** `https://fase-3-auth-service.onrender.com`
- **Vehicles Service:** `https://fase-3-vehicles-service.onrender.com`
- **Orders Service:** `https://fase-3-orders-service.onrender.com`

### **Tokens Automáticos:**
- `auth_token` → Token do admin
- `cliente_token` → Token do cliente
- `vendedor_token` → Token do vendedor

### **IDs Dinâmicos:**
- `user_id` → ID do usuário logado
- `vehicle_id` → ID do veículo criado
- `order_id` → ID do pedido criado

---

## 🚨 Troubleshooting

### **Erro de CORS:**
- Verifique se o CORS está configurado no backend
- Teste primeiro o health check

### **Token Inválido:**
- Faça login novamente
- Verifique se o token foi salvo automaticamente

### **Serviço Indisponível:**
- Verifique se o serviço está rodando no Render
- Teste o health check primeiro

---

## 📋 Checklist de Testes

- [ ] Health Check responde
- [ ] Login funciona
- [ ] Token é salvo automaticamente
- [ ] Criação de veículo funciona
- [ ] Listagem de veículos funciona
- [ ] Criação de pedido funciona
- [ ] Autorização por perfil funciona

---

## 🔄 Próximos Passos

1. **Teste o auth-service** (já funcionando)
2. **Deploy dos outros serviços** (vehicles e orders)
3. **Teste fluxo completo** com todos os serviços
4. **Configuração do frontend** na Vercel 