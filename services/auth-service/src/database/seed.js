require('dotenv').config();
const { connectDB } = require('../config/database');
const User = require('../models/User');
const logger = require('../config/logger');

const usuariosIniciais = [
  {
    nome: 'Administrador Sistema',
    email: 'admin@revenda.com',
    senha: 'admin123',
    cpf: '123.456.789-00',
    perfil: 'Admin',
    ativo: true
  },
  {
    nome: 'João Vendedor',
    email: 'vendedor@revenda.com',
    senha: 'vendedor123',
    cpf: '987.654.321-00',
    perfil: 'Vendedor',
    ativo: true
  },
  {
    nome: 'Maria Cliente',
    email: 'cliente@revenda.com',
    senha: 'cliente123',
    cpf: '111.222.333-44',
    perfil: 'Cliente',
    ativo: true
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    logger.info('Conectado ao banco de dados para seed');

    // Limpar usuários existentes (opcional - comentar se não quiser limpar)
    // await User.deleteMany({});
    // logger.info('Usuários existentes removidos');

    for (const dadosUsuario of usuariosIniciais) {
      // Verificar se usuário já existe
      const usuarioExistente = await User.buscarPorEmail(dadosUsuario.email);
      
      if (usuarioExistente) {
        logger.info(`Usuário ${dadosUsuario.email} já existe, pulando...`);
        continue;
      }

      // Criar novo usuário
      const novoUsuario = new User(dadosUsuario);
      await novoUsuario.save();
      
      logger.info(`Usuário criado: ${dadosUsuario.email} (${dadosUsuario.perfil})`);
    }

    logger.info('Seed do banco de dados concluído com sucesso');
    
    // Listar usuários criados
    const usuarios = await User.find({}).select('-senha');
    logger.info(`Total de usuários no banco: ${usuarios.length}`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executar seed se o arquivo for chamado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 