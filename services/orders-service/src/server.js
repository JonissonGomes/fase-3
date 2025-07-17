require('dotenv').config();

// Debug: Verificar variáveis de ambiente
console.log('=== DEBUG INFO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN || 'NOT SET');
console.log('==================');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Conectar ao banco de dados
connectDB();

// Middlewares de segurança
app.use(helmet());

// Configuração de CORS usando variável de ambiente
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin,
  credentials: corsOrigin !== '*', // Habilitar credentials apenas se não for wildcard
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: {
    erro: 'Muitas requisições deste IP, tente novamente mais tarde.',
    codigo: 'RATE_LIMIT_EXCEEDED'
  }
});
app.use(limiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Rotas
app.use('/orders', orderRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'orders-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    corsOrigin: corsOrigin
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  
  res.status(500).json({
    erro: 'Erro interno do servidor',
    codigo: 'INTERNAL_ERROR'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    codigo: 'ROUTE_NOT_FOUND'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Serviço de pedidos rodando na porta ${PORT}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`CORS Origin: ${corsOrigin}`);
  
  // Mostrar todas as rotas disponíveis
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `https://fase-3-orders-service.onrender.com`;
  console.log('\n📦 ORDERS SERVICE - ROTAS DISPONÍVEIS:');
  console.log('=======================================');
  console.log('GET    ' + baseUrl + '/health');
  console.log('POST   ' + baseUrl + '/orders');
  console.log('GET    ' + baseUrl + '/orders');
  console.log('GET    ' + baseUrl + '/orders/vendor');
  console.log('GET    ' + baseUrl + '/orders/:id');
  console.log('PUT    ' + baseUrl + '/orders/:id/approve');
  console.log('PUT    ' + baseUrl + '/orders/:id/reject');
  console.log('PUT    ' + baseUrl + '/orders/:id/complete');
  console.log('PUT    ' + baseUrl + '/orders/:id/cancel');
  console.log('=======================================');
  console.log(`🌐 URL Base: ${baseUrl}`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS: ${corsOrigin}`);
  console.log('=======================================\n');
});

// Tratamento de sinais para graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

module.exports = app; 