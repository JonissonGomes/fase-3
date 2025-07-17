const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicles_service';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Conectado ao MongoDB - Vehicles Service');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  logger.error('Erro na conexão MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB desconectado');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Conexão MongoDB fechada devido ao encerramento da aplicação');
  process.exit(0);
});

module.exports = { connectDB, mongoose }; 