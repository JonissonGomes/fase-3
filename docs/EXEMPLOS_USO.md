# Exemplos de Uso do Makefile

## Cenários Comuns de Desenvolvimento

### 🚀 Primeira Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd fase-3

# 2. Verificar dependências
make check-deps

# 3. Instalação completa
make setup

# 4. Verificar se tudo está funcionando
make health
make test-login
```

**Resultado esperado:**
- Todos os serviços rodando
- Banco populado com dados de teste
- Usuários de teste criados

### 🔧 Desenvolvimento Diário

```bash
# Iniciar serviços
make start

# Ver logs em tempo real
make logs

# Em outro terminal, executar testes
make test

# Parar serviços ao final do dia
make stop
```

### 🐛 Debug de Problemas

```bash
# 1. Verificar se há problemas
make check-deps
make check-ports
make check-logs

# 2. Se necessário, reconstruir
make rebuild

# 3. Verificar health
make health
```

### 🔄 Desenvolvimento Individual

```bash
# Trabalhar apenas no auth service
make dev-auth

# Em outro terminal, ver logs específicos
make logs-auth

# Em outro terminal, testar apenas o auth
make test-auth
```

## Cenários de Produção

### 🏭 Deploy Inicial

```bash
# 1. Configuração para produção
make prod-setup

# 2. Verificar configurações
make check-deps
make check-ports

# 3. Iniciar serviços
make start

# 4. Verificar health
make health
```

### 💾 Backup e Restore

```bash
# Fazer backup diário
make backup

# Listar backups disponíveis
ls -la backups/

# Restaurar backup específico
make restore BACKUP_DATE=20240115_143000
```

### 📊 Monitoramento

```bash
# Ver status dos containers
make status

# Monitorar recursos
make monitor

# Ver logs de erro
make check-logs
```

## Cenários de Troubleshooting

### 🔍 Problema: Serviço não inicia

```bash
# 1. Verificar dependências
make check-deps

# 2. Verificar portas
make check-ports

# 3. Ver logs de erro
make check-logs

# 4. Reconstruir containers
make rebuild

# 5. Verificar health
make health
```

### 🔍 Problema: Banco de dados não conecta

```bash
# 1. Verificar status do MongoDB
make status

# 2. Ver logs do MongoDB
docker-compose logs mongodb

# 3. Acessar MongoDB
make mongodb

# 4. Se necessário, reiniciar
make restart
```

### 🔍 Problema: Testes falhando

```bash
# 1. Verificar se serviços estão rodando
make health

# 2. Executar testes
make test

# 3. Se falhar, verificar logs
make check-logs

# 4. Reconstruir se necessário
make rebuild
```

## Cenários de Desenvolvimento Avançado

### 🔧 Desenvolvimento Local sem Docker

```bash
# Executar auth service localmente
make dev-auth

# Em outro terminal, executar vehicles service
make dev-vehicles

# Em outro terminal, executar orders service
make dev-orders
```

### 🧪 Testes Específicos

```bash
# Testar apenas auth service
make test-auth

# Testar apenas vehicles service
make test-vehicles

# Testar apenas orders service
make test-orders

# Testar integração completa
make test
```

### 🔨 Build Individual

```bash
# Reconstruir apenas auth service
make build-auth

# Reconstruir apenas vehicles service
make build-vehicles

# Reconstruir apenas orders service
make build-orders
```

## Cenários de Limpeza

### 🧹 Limpeza Parcial

```bash
# Parar e remover containers
make clean
```

### 🧹 Limpeza Completa

```bash
# Remover tudo (incluindo node_modules)
make clean-all

# Reinstalar do zero
make setup
```

## Cenários de Documentação

### 📚 Acessar Documentação

```bash
# Abrir documentação da API
make docs
```

### 📋 Ver Comandos Disponíveis

```bash
# Ver todos os comandos
make help
```

## Fluxos de Trabalho Completos

### 🔄 Fluxo de Desenvolvimento Completo

```bash
# 1. Iniciar ambiente
make start

# 2. Verificar status
make health

# 3. Executar testes
make test

# 4. Ver logs se necessário
make logs

# 5. Fazer alterações no código...

# 6. Reconstruir se necessário
make rebuild

# 7. Testar novamente
make test

# 8. Parar ao final
make stop
```

### 🔄 Fluxo de Debug Completo

```bash
# 1. Identificar problema
make check-deps
make check-ports
make check-logs

# 2. Verificar status
make status
make health

# 3. Acessar containers se necessário
make shell-auth
make shell-vehicles
make shell-orders

# 4. Reconstruir se necessário
make rebuild

# 5. Verificar se problema foi resolvido
make health
make test
```

### 🔄 Fluxo de Produção Completo

```bash
# 1. Preparar para produção
make prod-setup

# 2. Verificar configurações
make check-deps
make check-ports

# 3. Fazer backup antes do deploy
make backup

# 4. Deploy
make start

# 5. Verificar health
make health

# 6. Monitorar
make monitor
```

## Dicas e Truques

### 💡 Verificar Rapidamente

```bash
# Comando único para verificar tudo
make check-deps && make check-ports && make health
```

### 💡 Logs Específicos

```bash
# Ver logs de erro apenas
make check-logs

# Ver logs de serviço específico
make logs-auth
```

### 💡 Desenvolvimento Rápido

```bash
# Modo desenvolvimento com logs
make dev
```

### 💡 Backup Automático

```bash
# Adicionar ao crontab para backup diário
0 2 * * * cd /path/to/project && make backup
```

## Comandos Úteis para Scripts

### 📜 Script de Deploy

```bash
#!/bin/bash
echo "Iniciando deploy..."
make check-deps
make backup
make stop
make start
make health
echo "Deploy concluído!"
```

### 📜 Script de Teste

```bash
#!/bin/bash
echo "Executando testes..."
make start
sleep 10
make health
make test
make stop
echo "Testes concluídos!"
```

### 📜 Script de Limpeza

```bash
#!/bin/bash
echo "Limpando ambiente..."
make stop
make clean-all
echo "Limpeza concluída!"
```

## Troubleshooting Avançado

### 🔧 Problema: Make não encontrado

```bash
# No macOS
brew install make

# No Ubuntu/Debian
sudo apt-get install make

# No Windows (com WSL)
sudo apt-get install make
```

### 🔧 Problema: Permissões

```bash
# Verificar permissões
ls -la Makefile

# Dar permissão se necessário
chmod +x Makefile
```

### 🔧 Problema: Variáveis de ambiente

```bash
# Verificar se .env existe
ls -la .env

# Copiar exemplo se não existir
cp env.example .env
```

## Conclusão

O Makefile fornece uma interface simples e poderosa para gerenciar toda a plataforma. Use `make help` para ver todos os comandos disponíveis e adapte os exemplos acima para suas necessidades específicas. 