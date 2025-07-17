const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { 
  verificarToken, 
  apenasVendedor, 
  apenasCliente 
} = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(verificarToken);

// Rotas para Cliente e Admin
router.post('/', apenasCliente, orderController.criarPedido);
router.get('/', orderController.listarMeusPedidos);
router.get('/:id', orderController.buscarPedido);
router.put('/:id/cancel', apenasCliente, orderController.cancelarPedido);

// Rotas para Vendedor e Admin
router.get('/vendor/orders', apenasVendedor, orderController.listarPedidosRecebidos);
router.put('/:id/approve', apenasVendedor, orderController.aprovarPedido);
router.put('/:id/reject', apenasVendedor, orderController.rejeitarPedido);
router.put('/:id/complete', apenasVendedor, orderController.concluirPedido);

module.exports = router; 