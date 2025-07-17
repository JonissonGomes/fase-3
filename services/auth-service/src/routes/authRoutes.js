const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  verificarToken, 
  apenasAdmin, 
  verificarProprioUsuario,
  rateLimitPorUsuario 
} = require('../middleware/auth');

// Rate limiting para endpoints de autenticação
const authRateLimit = rateLimitPorUsuario(5, 15 * 60 * 1000); // 5 tentativas por 15 minutos

// Rotas públicas
router.post('/login', authRateLimit, authController.login);

// Rotas protegidas
router.use(verificarToken); // Aplicar middleware de autenticação em todas as rotas abaixo

// Rotas para usuários autenticados
router.get('/me', authController.obterMeuPerfil);

// Rotas restritas a Admin
router.post('/register', apenasAdmin, authController.cadastrarUsuario);
router.get('/users', apenasAdmin, authController.listarUsuarios);
router.delete('/users/:id', apenasAdmin, authController.desativarUsuario);

// Rotas para Admin ou próprio usuário
router.get('/users/:id', verificarProprioUsuario, authController.buscarUsuario);
router.put('/users/:id', verificarProprioUsuario, authController.atualizarUsuario);

module.exports = router; 