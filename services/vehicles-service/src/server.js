require('dotenv').config();

// Debug: Verificar variáveis de ambiente
console.log('=== DEBUG INFO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('MONGODB_URI value:', process.env.MONGODB_URI || 'NOT SET');
console.log('==================');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Conectar ao banco de dados
connectDB();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
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
app.use('/vehicles', vehicleRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'vehicles-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
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
  logger.info(`Serviço de veículos rodando na porta ${PORT}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
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