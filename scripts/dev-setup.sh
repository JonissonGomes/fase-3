#!/bin/bash

# Script para configurar o ambiente de desenvolvimento da Plataforma de Revenda

echo "🚀 Configurando ambiente de desenvolvimento da Plataforma de Revenda..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar diretórios de logs se não existirem
echo "📁 Criando diretórios de logs..."
mkdir -p services/auth-service/logs
mkdir -p services/vehicles-service/logs
mkdir -p services/orders-service/logs

# Instalar dependências dos serviços
echo "📦 Instalando dependências dos serviços..."

cd services/auth-service
npm install
cd ../..

cd services/vehicles-service
npm install
cd ../..

cd services/orders-service
npm install
cd ../..

echo "✅ Dependências instaladas com sucesso!"

# Construir e iniciar os containers
echo "🐳 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar os serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Executar seed do banco de dados
echo "🌱 Executando seed do banco de dados..."
docker-compose exec auth-service npm run seed

echo "🎉 Ambiente de desenvolvimento configurado com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "   • Frontend: http://localhost:3000"
echo "   • Auth Service: http://localhost:3001"
echo "   • Vehicles Service: http://localhost:3002"
echo "   • Orders Service: http://localhost:3003"
echo "   • MongoDB: localhost:27017"
echo ""
echo "👤 Usuários de teste criados:"
echo "   • Admin: admin@revenda.com / admin123"
echo "   • Vendedor: vendedor@revenda.com / vendedor123"
echo "   • Cliente: cliente@revenda.com / cliente123"
echo ""
echo "🔧 Comandos úteis:"
echo "   • Parar serviços: docker-compose down"
echo "   • Ver logs: docker-compose logs -f [service-name]"
echo "   • Reiniciar serviço: docker-compose restart [service-name]" 