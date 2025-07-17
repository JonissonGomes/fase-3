const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { 
  verificarToken, 
  apenasVendedor, 
  apenasCliente,
  verificarVendedorVeiculo 
} = require('../middleware/auth');

// Rotas públicas (não precisam de autenticação)
router.get('/', vehicleController.listarVeiculosAVenda);
router.get('/:id', vehicleController.buscarVeiculo);

// Rotas protegidas
router.use(verificarToken);

// Rotas para Vendedor e Admin
router.post('/', apenasVendedor, vehicleController.criarVeiculo);
router.get('/my/vehicles', apenasVendedor, vehicleController.listarMeusVeiculos);
router.get('/sold/vehicles', apenasVendedor, vehicleController.listarVeiculosVendidos);

// Rotas para edição/remoção (Vendedor do veículo ou Admin)
router.put('/:id', verificarVendedorVeiculo, vehicleController.atualizarVeiculo);
router.delete('/:id', verificarVendedorVeiculo, vehicleController.removerVeiculo);

// Rota para integração com orders-service (marcar como vendido)
router.post('/:id/sell', vehicleController.marcarComoVendido);

module.exports = router; 