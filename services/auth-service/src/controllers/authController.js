const User = require('../models/User');
const logger = require('../config/logger');

class AuthController {
  // POST /auth/register - Cadastrar usuário (apenas Admin)
  async cadastrarUsuario(req, res) {
    try {
      const { nome, email, senha, cpf, perfil } = req.body;

      // Validação dos dados de entrada
      const { error } = User.validarDados({ nome, email, senha, cpf, perfil });
      if (error) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          detalhes: error.details.map(detail => detail.message),
          codigo: 'VALIDATION_ERROR'
        });
      }

      // Verificar se email já existe
      const usuarioExistente = await User.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({
          erro: 'Email já cadastrado',
          codigo: 'EMAIL_ALREADY_EXISTS'
        });
      }

      // Verificar se CPF já existe
      const cpfExistente = await User.buscarPorCPF(cpf);
      if (cpfExistente) {
        return res.status(409).json({
          erro: 'CPF já cadastrado',
          codigo: 'CPF_ALREADY_EXISTS'
        });
      }

      // Criar novo usuário
      const novoUsuario = new User({
        nome,
        email,
        senha,
        cpf,
        perfil: perfil || 'Cliente'
      });

      await novoUsuario.save();

      logger.info(`Usuário cadastrado: ${email} (${perfil}) por ${req.usuario.email}`);

      res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso',
        usuario: novoUsuario.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao cadastrar usuário:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // POST /auth/login - Autenticar usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Validação básica
      if (!email || !senha) {
        return res.status(400).json({
          erro: 'Email e senha são obrigatórios',
          codigo: 'MISSING_CREDENTIALS'
        });
      }

      // Buscar usuário por email
      const usuario = await User.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({
          erro: 'Credenciais inválidas',
          codigo: 'INVALID_CREDENTIALS'
        });
      }

      // Verificar se usuário está ativo
      if (!usuario.ativo) {
        return res.status(401).json({
          erro: 'Conta desativada',
          codigo: 'ACCOUNT_DISABLED'
        });
      }

      // Verificar senha
      const senhaValida = await usuario.compararSenha(senha);
      if (!senhaValida) {
        logger.warn(`Tentativa de login falhou para: ${email}`);
        return res.status(401).json({
          erro: 'Credenciais inválidas',
          codigo: 'INVALID_CREDENTIALS'
        });
      }

      // Atualizar último login
      usuario.ultimoLogin = new Date();
      await usuario.save();

      // Gerar token JWT
      const token = usuario.gerarToken();

      logger.info(`Login realizado com sucesso: ${email} (${usuario.perfil})`);

      res.json({
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: usuario.toPublicJSON(),
        expiraEm: '24h'
      });

    } catch (error) {
      logger.error('Erro no login:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /auth/users - Listar usuários (apenas Admin)
  async listarUsuarios(req, res) {
    try {
      const { pagina = 1, limite = 10, perfil, ativo, busca } = req.query;
      
      const filtros = {};
      
      if (perfil) {
        filtros.perfil = perfil;
      }
      
      if (ativo !== undefined) {
        filtros.ativo = ativo === 'true';
      }
      
      if (busca) {
        filtros.$or = [
          { nome: { $regex: busca, $options: 'i' } },
          { email: { $regex: busca, $options: 'i' } },
          { cpf: { $regex: busca, $options: 'i' } }
        ];
      }

      const opcoes = {
        page: parseInt(pagina),
        limit: parseInt(limite),
        sort: { dataCadastro: -1 },
        select: '-senha'
      };

      const resultado = await User.paginate(filtros, opcoes);

      res.json({
        usuarios: resultado.docs,
        paginacao: {
          pagina: resultado.page,
          totalPaginas: resultado.totalPages,
          totalUsuarios: resultado.totalDocs,
          usuariosPorPagina: resultado.limit
        }
      });

    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /auth/users/:id - Buscar usuário específico
  async buscarUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id).select('-senha');
      
      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado',
          codigo: 'USER_NOT_FOUND'
        });
      }

      res.json({
        usuario: usuario.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // PUT /auth/users/:id - Atualizar usuário (Admin ou próprio usuário)
  async atualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      // Validação dos dados de atualização
      const { error } = User.validarAtualizacao(dadosAtualizacao);
      if (error) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          detalhes: error.details.map(detail => detail.message),
          codigo: 'VALIDATION_ERROR'
        });
      }

      // Verificar se usuário existe
      const usuario = await User.findById(id);
      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado',
          codigo: 'USER_NOT_FOUND'
        });
      }

      // Verificar se email já existe (se estiver sendo atualizado)
      if (dadosAtualizacao.email && dadosAtualizacao.email !== usuario.email) {
        const emailExistente = await User.buscarPorEmail(dadosAtualizacao.email);
        if (emailExistente) {
          return res.status(409).json({
            erro: 'Email já cadastrado',
            codigo: 'EMAIL_ALREADY_EXISTS'
          });
        }
      }

      // Verificar se CPF já existe (se estiver sendo atualizado)
      if (dadosAtualizacao.cpf && dadosAtualizacao.cpf !== usuario.cpf) {
        const cpfExistente = await User.buscarPorCPF(dadosAtualizacao.cpf);
        if (cpfExistente) {
          return res.status(409).json({
            erro: 'CPF já cadastrado',
            codigo: 'CPF_ALREADY_EXISTS'
          });
        }
      }

      // Atualizar usuário
      Object.assign(usuario, dadosAtualizacao);
      await usuario.save();

      logger.info(`Usuário atualizado: ${usuario.email} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Usuário atualizado com sucesso',
        usuario: usuario.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao atualizar usuário:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // DELETE /auth/users/:id - Desativar usuário (apenas Admin)
  async desativarUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);
      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado',
          codigo: 'USER_NOT_FOUND'
        });
      }

      // Não permitir desativar o próprio usuário
      if (req.usuario._id.toString() === id) {
        return res.status(400).json({
          erro: 'Não é possível desativar sua própria conta',
          codigo: 'SELF_DISABLE_NOT_ALLOWED'
        });
      }

      usuario.ativo = false;
      await usuario.save();

      logger.info(`Usuário desativado: ${usuario.email} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Usuário desativado com sucesso'
      });

    } catch (error) {
      logger.error('Erro ao desativar usuário:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /auth/me - Obter dados do usuário logado
  async obterMeuPerfil(req, res) {
    try {
      res.json({
        usuario: req.usuario.toPublicJSON()
      });
    } catch (error) {
      logger.error('Erro ao obter perfil:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = new AuthController(); 