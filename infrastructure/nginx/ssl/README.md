# Configuração SSL/TLS para Produção

## 📋 Visão Geral

Este diretório é destinado aos certificados SSL/TLS necessários para o ambiente de produção.

## 🔐 Certificados Necessários

### Para Produção:
- `cert.pem` - Certificado público
- `key.pem` - Chave privada
- `chain.pem` - Cadeia de certificados (se necessário)

## 🚀 Opções de Certificados

### 1. Let's Encrypt (Gratuito - Recomendado)
```bash
# Instalar certbot
sudo apt-get install certbot

# Gerar certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar certificados
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./cert.pem
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./key.pem
```

### 2. Certificado Auto-assinado (Desenvolvimento)
```bash
# Gerar certificado auto-assinado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=BR/ST=SP/L=Sao Paulo/O=Revenda Veiculos/CN=localhost"
```

### 3. Certificado Comercial
- Comprar certificado de uma CA confiável
- Fazer upload dos arquivos para este diretório

## ⚙️ Configuração no Nginx

### 1. Descomente as linhas SSL no `nginx.conf`:
```nginx
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
```

### 2. Configure o domínio no `docker-compose.prod.yml`:
```yaml
nginx:
  environment:
    - DOMAIN=seu-dominio.com
```

## 🔄 Renovação Automática (Let's Encrypt)

### Script de Renovação:
```bash
#!/bin/bash
# renovar-ssl.sh

# Renovar certificados
certbot renew

# Copiar novos certificados
cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./cert.pem
cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./key.pem

# Reiniciar Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Cron Job (renovação automática):
```bash
# Adicionar ao crontab
0 12 * * * /path/to/renovar-ssl.sh
```

## 🛡️ Segurança

### Permissões dos Arquivos:
```bash
# Definir permissões seguras
chmod 600 key.pem
chmod 644 cert.pem
```

### Backup:
```bash
# Fazer backup dos certificados
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz cert.pem key.pem
```

## 🚨 Importante

1. **Nunca commite certificados no Git**
2. **Mantenha backups seguros**
3. **Configure renovação automática**
4. **Monitore expiração dos certificados**
5. **Use HTTPS em produção sempre**

## 📞 Suporte

Para problemas com SSL/TLS:
1. Verificar logs do Nginx: `docker-compose -f docker-compose.prod.yml logs nginx`
2. Testar certificado: `openssl x509 -in cert.pem -text -noout`
3. Verificar conectividade: `curl -I https://seu-dominio.com` 