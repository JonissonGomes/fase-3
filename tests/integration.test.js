const axios = require('axios');

// Configurações
const BASE_URLS = {
  auth: 'http://localhost:3001',
  vehicles: 'http://localhost:3002',
  orders: 'http://localhost:3003'
};

// Dados de teste
const TEST_USERS = {
  admin: {
    email: 'admin@revenda.com',
    senha: 'admin123'
  },
  vendedor: {
    email: 'vendedor@revenda.com',
    senha: 'vendedor123'
  },
  cliente: {
    email: 'cliente@revenda.com',
    senha: 'cliente123'
  }
};

let tokens = {};
let testVehicleId = null;
let testOrderId = null;

// Função para fazer login
async function login(userType) {
  try {
    const response = await axios.post(`${BASE_URLS.auth}/auth/login`, TEST_USERS[userType]);
    tokens[userType] = response.data.token;
    console.log(`✅ Login ${userType} realizado com sucesso`);
    return response.data.token;
  } catch (error) {
    console.error(`❌ Erro no login ${userType}:`, error.response?.data || error.message);
    throw error;
  }
}

// Função para criar veículo
async function createVehicle() {
  try {
    const vehicleData = {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2020,
      cor: 'Prata',
      preco: 85000,
      descricao: 'Veículo em excelente estado',
      quilometragem: 45000,
      combustivel: 'Flex',
      transmissao: 'Automático'
    };

    const response = await axios.post(`${BASE_URLS.vehicles}/vehicles`, vehicleData, {
      headers: { Authorization: `Bearer ${tokens.vendedor}` }
    });

    testVehicleId = response.data.veiculo._id;
    console.log(`✅ Veículo criado com sucesso: ${testVehicleId}`);
    return response.data.veiculo;
  } catch (error) {
    console.error('❌ Erro ao criar veículo:', error.response?.data || error.message);
    throw error;
  }
}

// Função para listar veículos
async function listVehicles() {
  try {
    const response = await axios.get(`${BASE_URLS.vehicles}/vehicles`);
    console.log(`✅ Veículos listados: ${response.data.veiculos.length} encontrados`);
    return response.data.veiculos;
  } catch (error) {
    console.error('❌ Erro ao listar veículos:', error.response?.data || error.message);
    throw error;
  }
}

// Função para criar pedido
async function createOrder() {
  try {
    const orderData = {
      veiculoId: testVehicleId,
      precoFinal: 85000,
      observacoes: 'Interessado em financiamento',
      metodoPagamento: 'cartao_credito',
      parcelas: 12,
      valorParcela: 7083.33
    };

    const response = await axios.post(`${BASE_URLS.orders}/orders`, orderData, {
      headers: { Authorization: `Bearer ${tokens.cliente}` }
    });

    testOrderId = response.data.pedido._id;
    console.log(`✅ Pedido criado com sucesso: ${testOrderId}`);
    return response.data.pedido;
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error.response?.data || error.message);
    throw error;
  }
}

// Função para aprovar pedido
async function approveOrder() {
  try {
    const response = await axios.put(`${BASE_URLS.orders}/orders/${testOrderId}/approve`, {}, {
      headers: { Authorization: `Bearer ${tokens.vendedor}` }
    });
    console.log(`✅ Pedido aprovado com sucesso`);
    return response.data.pedido;
  } catch (error) {
    console.error('❌ Erro ao aprovar pedido:', error.response?.data || error.message);
    throw error;
  }
}

// Função para listar pedidos
async function listOrders() {
  try {
    const response = await axios.get(`${BASE_URLS.orders}/orders`, {
      headers: { Authorization: `Bearer ${tokens.cliente}` }
    });
    console.log(`✅ Pedidos listados: ${response.data.pedidos.length} encontrados`);
    return response.data.pedidos;
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error.response?.data || error.message);
    throw error;
  }
}

// Função para verificar health dos serviços
async function checkHealth() {
  try {
    const services = ['auth', 'vehicles', 'orders'];
    
    for (const service of services) {
      const response = await axios.get(`${BASE_URLS[service]}/health`);
      console.log(`✅ ${service}-service: ${response.data.status}`);
    }
  } catch (error) {
    console.error('❌ Erro ao verificar health:', error.message);
  }
}

// Teste principal
async function runIntegrationTest() {
  console.log('🚀 Iniciando testes de integração...\n');

  try {
    // 1. Verificar health dos serviços
    console.log('1. Verificando health dos serviços...');
    await checkHealth();
    console.log('');

    // 2. Login dos usuários
    console.log('2. Realizando login dos usuários...');
    await login('admin');
    await login('vendedor');
    await login('cliente');
    console.log('');

    // 3. Listar veículos existentes
    console.log('3. Listando veículos existentes...');
    await listVehicles();
    console.log('');

    // 4. Criar veículo
    console.log('4. Criando veículo...');
    await createVehicle();
    console.log('');

    // 5. Listar veículos novamente
    console.log('5. Listando veículos após criação...');
    await listVehicles();
    console.log('');

    // 6. Criar pedido
    console.log('6. Criando pedido...');
    await createOrder();
    console.log('');

    // 7. Listar pedidos do cliente
    console.log('7. Listando pedidos do cliente...');
    await listOrders();
    console.log('');

    // 8. Aprovar pedido
    console.log('8. Aprovando pedido...');
    await approveOrder();
    console.log('');

    // 9. Listar pedidos novamente
    console.log('9. Listando pedidos após aprovação...');
    await listOrders();
    console.log('');

    console.log('🎉 Todos os testes de integração passaram com sucesso!');

  } catch (error) {
    console.error('💥 Erro durante os testes:', error.message);
    process.exit(1);
  }
}

// Executar testes se o arquivo for chamado diretamente
if (require.main === module) {
  runIntegrationTest();
}

module.exports = {
  runIntegrationTest,
  login,
  createVehicle,
  listVehicles,
  createOrder,
  approveOrder,
  listOrders,
  checkHealth
}; 