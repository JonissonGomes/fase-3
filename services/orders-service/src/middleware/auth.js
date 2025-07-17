const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        erro: 'Token de acesso não fornecido',
        codigo: 'TOKEN_MISSING'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' do início
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    
    // Armazenar informações do usuário no request
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      perfil: decoded.perfil
    };

    next();
  } catch (error) {
    logger.error('Erro na verificação do token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        erro: 'Token inválido',
        codigo: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        erro: 'Token expirado',
        codigo: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(500).json({ 
      erro: 'Erro interno do servidor',
      codigo: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar perfil específico
const verificarPerfil = (perfisPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        erro: 'Usuário não autenticado',
        codigo: 'NOT_AUTHENTICATED'
      });
    }

    const perfis = Array.isArray(perfisPermitidos) ? perfisPermitidos : [perfisPermitidos];
    
    if (!perfis.includes(req.usuario.perfil)) {
      logger.warn(`Acesso negado: usuário ${req.usuario.email} (${req.usuario.perfil}) tentou acessar recurso restrito a ${perfis.join(', ')}`);
      
      return res.status(403).json({ 
        erro: 'Acesso negado. Perfil insuficiente.',
        codigo: 'INSUFFICIENT_PERMISSIONS',
        perfilAtual: req.usuario.perfil,
        perfisNecessarios: perfis
      });
    }

    next();
  };
};

// Middlewares específicos para cada perfil
const apenasAdmin = verificarPerfil('Admin');
const apenasVendedor = verificarPerfil(['Vendedor', 'Admin']);
const apenasCliente = verificarPerfil(['Cliente', 'Vendedor', 'Admin']);

module.exports = {
  verificarToken,
  verificarPerfil,
  apenasAdmin,
  apenasVendedor,
  apenasCliente
}; 