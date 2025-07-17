const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
    
    // Buscar usuário no banco para verificar se ainda existe e está ativo
    const usuario = await User.findById(decoded.id).select('-senha');
    
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ 
        erro: 'Token inválido ou usuário inativo',
        codigo: 'INVALID_TOKEN'
      });
    }

    req.usuario = usuario;
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

// Middleware para verificar se o usuário está tentando acessar seus próprios dados
const verificarProprioUsuario = (req, res, next) => {
  const userId = req.params.id || req.params.userId;
  
  if (!userId) {
    return res.status(400).json({ 
      erro: 'ID do usuário não fornecido',
      codigo: 'USER_ID_MISSING'
    });
  }

  // Admin pode acessar qualquer usuário
  if (req.usuario.perfil === 'Admin') {
    return next();
  }

  // Outros usuários só podem acessar seus próprios dados
  if (req.usuario._id.toString() !== userId) {
    return res.status(403).json({ 
      erro: 'Acesso negado. Você só pode acessar seus próprios dados.',
      codigo: 'ACCESS_DENIED'
    });
  }

  next();
};

// Middleware para rate limiting específico por usuário
const rateLimitPorUsuario = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!req.usuario) {
      return next();
    }

    const userId = req.usuario._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(userId)) {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);
    
    // Remove requisições antigas
    const recentRequests = userRequests.filter(time => time > windowStart);
    requests.set(userId, recentRequests);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        erro: 'Muitas requisições. Tente novamente mais tarde.',
        codigo: 'RATE_LIMIT_EXCEEDED'
      });
    }

    recentRequests.push(now);
    next();
  };
};

module.exports = {
  verificarToken,
  verificarPerfil,
  apenasAdmin,
  apenasVendedor,
  apenasCliente,
  verificarProprioUsuario,
  rateLimitPorUsuario
}; 