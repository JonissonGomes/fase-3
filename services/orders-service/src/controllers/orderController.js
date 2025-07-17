const Order = require('../models/Order');
const vehicleService = require('../services/vehicleService');
const logger = require('../config/logger');

class OrderController {
  // POST /orders - Criar pedido (Cliente, Admin)
  async criarPedido(req, res) {
    try {
      const { veiculoId, precoFinal, observacoes, metodoPagamento, parcelas, valorParcela } = req.body;
      const compradorId = req.usuario.id;

      // Validação dos dados de entrada
      const { error } = Order.validarDados({ 
        veiculoId, 
        precoFinal, 
        observacoes, 
        metodoPagamento, 
        parcelas, 
        valorParcela 
      });
      
      if (error) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          detalhes: error.details.map(detail => detail.message),
          codigo: 'VALIDATION_ERROR'
        });
      }

      // Verificar se veículo está disponível
      let veiculoInfo;
      try {
        veiculoInfo = await vehicleService.validarVeiculoParaCompra(veiculoId);
      } catch (error) {
        return res.status(400).json({
          erro: error.message,
          codigo: 'VEHICLE_NOT_AVAILABLE'
        });
      }

      // Verificar se o comprador não está tentando comprar seu próprio veículo
      if (veiculoInfo.vendedor === compradorId) {
        return res.status(400).json({
          erro: 'Você não pode comprar seu próprio veículo',
          codigo: 'SELF_PURCHASE_NOT_ALLOWED'
        });
      }

      // Verificar se preço final é válido
      if (precoFinal < veiculoInfo.preco) {
        return res.status(400).json({
          erro: 'Preço final não pode ser menor que o preço do veículo',
          codigo: 'INVALID_PRICE'
        });
      }

      // Criar novo pedido
      const novoPedido = new Order({
        veiculo: veiculoId,
        comprador: compradorId,
        vendedor: veiculoInfo.vendedor,
        precoFinal,
        observacoes,
        metodoPagamento,
        parcelas,
        valorParcela
      });

      await novoPedido.save();

      logger.info(`Pedido criado: ${novoPedido._id} para veículo ${veiculoInfo.marca} ${veiculoInfo.modelo} por ${req.usuario.email}`);

      res.status(201).json({
        mensagem: 'Pedido criado com sucesso',
        pedido: novoPedido.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao criar pedido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /orders - Listar pedidos do usuário logado
  async listarMeusPedidos(req, res) {
    try {
      const { 
        pagina = 1, 
        limite = 10,
        status 
      } = req.query;

      const filtros = { comprador: req.usuario.id };
      
      if (status) {
        filtros.status = status;
      }

      const opcoes = {
        page: parseInt(pagina),
        limit: parseInt(limite),
        sort: { dataCompra: -1 },
        populate: [
          { path: 'veiculo', select: 'marca modelo ano cor preco' },
          { path: 'vendedor', select: 'nome email' }
        ]
      };

      const resultado = await Order.paginate(filtros, opcoes);

      res.json({
        pedidos: resultado.docs,
        paginacao: {
          pagina: resultado.page,
          totalPaginas: resultado.totalPages,
          totalPedidos: resultado.totalDocs,
          pedidosPorPagina: resultado.limit
        }
      });

    } catch (error) {
      logger.error('Erro ao listar meus pedidos:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /orders/vendor - Listar pedidos recebidos (Vendedor)
  async listarPedidosRecebidos(req, res) {
    try {
      const { 
        pagina = 1, 
        limite = 10,
        status 
      } = req.query;

      const filtros = { vendedor: req.usuario.id };
      
      if (status) {
        filtros.status = status;
      }

      const opcoes = {
        page: parseInt(pagina),
        limit: parseInt(limite),
        sort: { dataCompra: -1 },
        populate: [
          { path: 'veiculo', select: 'marca modelo ano cor preco' },
          { path: 'comprador', select: 'nome email' }
        ]
      };

      const resultado = await Order.paginate(filtros, opcoes);

      res.json({
        pedidos: resultado.docs,
        paginacao: {
          pagina: resultado.page,
          totalPaginas: resultado.totalPages,
          totalPedidos: resultado.totalDocs,
          pedidosPorPagina: resultado.limit
        }
      });

    } catch (error) {
      logger.error('Erro ao listar pedidos recebidos:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /orders/:id - Buscar pedido específico
  async buscarPedido(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Order.findById(id)
        .populate('veiculo', 'marca modelo ano cor preco')
        .populate('comprador', 'nome email')
        .populate('vendedor', 'nome email');
      
      if (!pedido) {
        return res.status(404).json({
          erro: 'Pedido não encontrado',
          codigo: 'ORDER_NOT_FOUND'
        });
      }

      // Verificar se usuário tem permissão para ver este pedido
      if (req.usuario.perfil !== 'Admin' && 
          pedido.comprador.toString() !== req.usuario.id && 
          pedido.vendedor.toString() !== req.usuario.id) {
        return res.status(403).json({
          erro: 'Acesso negado. Você não tem permissão para ver este pedido.',
          codigo: 'ACCESS_DENIED'
        });
      }

      res.json({
        pedido: pedido.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao buscar pedido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // PUT /orders/:id/approve - Aprovar pedido (Vendedor)
  async aprovarPedido(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Order.findById(id);
      if (!pedido) {
        return res.status(404).json({
          erro: 'Pedido não encontrado',
          codigo: 'ORDER_NOT_FOUND'
        });
      }

      // Verificar se usuário é o vendedor
      if (req.usuario.perfil !== 'Admin' && pedido.vendedor.toString() !== req.usuario.id) {
        return res.status(403).json({
          erro: 'Acesso negado. Apenas o vendedor pode aprovar o pedido.',
          codigo: 'ACCESS_DENIED'
        });
      }

      // Verificar se pedido pode ser aprovado
      if (pedido.status !== 'pendente') {
        return res.status(400).json({
          erro: 'Apenas pedidos pendentes podem ser aprovados',
          codigo: 'INVALID_STATUS_CHANGE'
        });
      }

      // Marcar veículo como vendido
      try {
        await vehicleService.marcarComoVendido(pedido.veiculo.toString(), pedido.comprador.toString());
      } catch (error) {
        return res.status(400).json({
          erro: 'Erro ao processar venda do veículo',
          codigo: 'VEHICLE_SALE_ERROR'
        });
      }

      // Aprovar pedido
      await pedido.aprovar();

      logger.info(`Pedido aprovado: ${pedido._id} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Pedido aprovado com sucesso',
        pedido: pedido.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao aprovar pedido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // PUT /orders/:id/reject - Rejeitar pedido (Vendedor)
  async rejeitarPedido(req, res) {
    try {
      const { id } = req.params;
      const { observacoes } = req.body;

      const pedido = await Order.findById(id);
      if (!pedido) {
        return res.status(404).json({
          erro: 'Pedido não encontrado',
          codigo: 'ORDER_NOT_FOUND'
        });
      }

      // Verificar se usuário é o vendedor
      if (req.usuario.perfil !== 'Admin' && pedido.vendedor.toString() !== req.usuario.id) {
        return res.status(403).json({
          erro: 'Acesso negado. Apenas o vendedor pode rejeitar o pedido.',
          codigo: 'ACCESS_DENIED'
        });
      }

      // Verificar se pedido pode ser rejeitado
      if (pedido.status !== 'pendente') {
        return res.status(400).json({
          erro: 'Apenas pedidos pendentes podem ser rejeitados',
          codigo: 'INVALID_STATUS_CHANGE'
        });
      }

      await pedido.rejeitar(observacoes);

      logger.info(`Pedido rejeitado: ${pedido._id} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Pedido rejeitado com sucesso',
        pedido: pedido.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao rejeitar pedido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // PUT /orders/:id/complete - Concluir pedido (Vendedor)
  async concluirPedido(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Order.findById(id);
      if (!pedido) {
        return res.status(404).json({
          erro: 'Pedido não encontrado',
          codigo: 'ORDER_NOT_FOUND'
        });
      }

      // Verificar se usuário é o vendedor
      if (req.usuario.perfil !== 'Admin' && pedido.vendedor.toString() !== req.usuario.id) {
        return res.status(403).json({
          erro: 'Acesso negado. Apenas o vendedor pode concluir o pedido.',
          codigo: 'ACCESS_DENIED'
        });
      }

      // Verificar se pedido pode ser concluído
      if (pedido.status !== 'aprovado') {
        return res.status(400).json({
          erro: 'Apenas pedidos aprovados podem ser concluídos',
          codigo: 'INVALID_STATUS_CHANGE'
        });
      }

      await pedido.concluir();

      logger.info(`Pedido concluído: ${pedido._id} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Pedido concluído com sucesso',
        pedido: pedido.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao concluir pedido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // PUT /orders/:id/cancel - Cancelar pedido (Comprador)
  async cancelarPedido(req, res) {
    try {
      const { id } = req.params;
      const { observacoes } = req.body;

      const pedido = await Order.findById(id);
      if (!pedido) {
        return res.status(404).json({
          erro: 'Pedido não encontrado',
          codigo: 'ORDER_NOT_FOUND'
        });
      }

      // Verificar se usuário é o comprador
      if (req.usuario.perfil !== 'Admin' && pedido.comprador.toString() !== req.usuario.id) {
        return res.status(403).json({
          erro: 'Acesso negado. Apenas o comprador pode cancelar o pedido.',
          codigo: 'ACCESS_DENIED'
        });
      }

      // Verificar se pedido pode ser cancelado
      if (!['pendente', 'aprovado'].includes(pedido.status)) {
        return res.status(400).json({
          erro: 'Apenas pedidos pendentes ou aprovados podem ser cancelados',
          codigo: 'INVALID_STATUS_CHANGE'
        });
      }

      await pedido.cancelar(observacoes);

      logger.info(`Pedido cancelado: ${pedido._id} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Pedido cancelado com sucesso',
        pedido: pedido.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao cancelar pedido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = new OrderController(); 