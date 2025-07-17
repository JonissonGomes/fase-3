const Vehicle = require('../models/Vehicle');
const logger = require('../config/logger');

class VehicleController {
  // POST /vehicles - Criar veículo (Vendedor, Admin)
  async criarVeiculo(req, res) {
    try {
      const dadosVeiculo = req.body;
      dadosVeiculo.vendedor = req.usuario.id;

      // Validação dos dados de entrada
      const { error } = Vehicle.validarDados(dadosVeiculo);
      if (error) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          detalhes: error.details.map(detail => detail.message),
          codigo: 'VALIDATION_ERROR'
        });
      }

      // Criar novo veículo
      const novoVeiculo = new Vehicle(dadosVeiculo);
      await novoVeiculo.save();

      logger.info(`Veículo criado: ${novoVeiculo.marca} ${novoVeiculo.modelo} por ${req.usuario.email}`);

      res.status(201).json({
        mensagem: 'Veículo criado com sucesso',
        veiculo: novoVeiculo.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao criar veículo:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /vehicles - Listar veículos à venda (todos)
  async listarVeiculosAVenda(req, res) {
    try {
      const { 
        pagina = 1, 
        limite = 10, 
        marca, 
        modelo, 
        anoMin, 
        anoMax, 
        precoMin, 
        precoMax,
        combustivel,
        transmissao,
        ordenacao = 'preco'
      } = req.query;

      const filtros = { status: 'à venda' };
      
      if (marca) {
        filtros.marca = { $regex: marca, $options: 'i' };
      }
      
      if (modelo) {
        filtros.modelo = { $regex: modelo, $options: 'i' };
      }
      
      if (anoMin || anoMax) {
        filtros.ano = {};
        if (anoMin) filtros.ano.$gte = parseInt(anoMin);
        if (anoMax) filtros.ano.$lte = parseInt(anoMax);
      }
      
      if (precoMin || precoMax) {
        filtros.preco = {};
        if (precoMin) filtros.preco.$gte = parseFloat(precoMin);
        if (precoMax) filtros.preco.$lte = parseFloat(precoMax);
      }
      
      if (combustivel) {
        filtros.combustivel = combustivel;
      }
      
      if (transmissao) {
        filtros.transmissao = transmissao;
      }

      // Definir ordenação
      let sortOptions = {};
      switch (ordenacao) {
        case 'preco':
          sortOptions = { preco: 1 };
          break;
        case 'preco-desc':
          sortOptions = { preco: -1 };
          break;
        case 'ano':
          sortOptions = { ano: -1 };
          break;
        case 'data':
          sortOptions = { createdAt: -1 };
          break;
        default:
          sortOptions = { preco: 1 };
      }

      const opcoes = {
        page: parseInt(pagina),
        limit: parseInt(limite),
        sort: sortOptions,
        populate: {
          path: 'vendedor',
          select: 'nome email'
        }
      };

      const resultado = await Vehicle.paginate(filtros, opcoes);

      res.json({
        veiculos: resultado.docs,
        paginacao: {
          pagina: resultado.page,
          totalPaginas: resultado.totalPages,
          totalVeiculos: resultado.totalDocs,
          veiculosPorPagina: resultado.limit
        }
      });

    } catch (error) {
      logger.error('Erro ao listar veículos à venda:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /vehicles/sold - Listar veículos vendidos (Vendedor, Admin)
  async listarVeiculosVendidos(req, res) {
    try {
      const { 
        pagina = 1, 
        limite = 10,
        dataInicio,
        dataFim,
        ordenacao = 'dataVenda'
      } = req.query;

      const filtros = { status: 'vendido' };
      
      if (dataInicio || dataFim) {
        filtros.dataVenda = {};
        if (dataInicio) filtros.dataVenda.$gte = new Date(dataInicio);
        if (dataFim) filtros.dataVenda.$lte = new Date(dataFim);
      }

      // Se não for Admin, mostrar apenas veículos do vendedor
      if (req.usuario.perfil !== 'Admin') {
        filtros.vendedor = req.usuario.id;
      }

      // Definir ordenação
      let sortOptions = {};
      switch (ordenacao) {
        case 'preco':
          sortOptions = { preco: 1 };
          break;
        case 'preco-desc':
          sortOptions = { preco: -1 };
          break;
        case 'dataVenda':
          sortOptions = { dataVenda: -1 };
          break;
        default:
          sortOptions = { dataVenda: -1 };
      }

      const opcoes = {
        page: parseInt(pagina),
        limit: parseInt(limite),
        sort: sortOptions,
        populate: [
          { path: 'vendedor', select: 'nome email' },
          { path: 'comprador', select: 'nome email' }
        ]
      };

      const resultado = await Vehicle.paginate(filtros, opcoes);

      res.json({
        veiculos: resultado.docs,
        paginacao: {
          pagina: resultado.page,
          totalPaginas: resultado.totalPages,
          totalVeiculos: resultado.totalDocs,
          veiculosPorPagina: resultado.limit
        }
      });

    } catch (error) {
      logger.error('Erro ao listar veículos vendidos:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /vehicles/:id - Buscar veículo específico
  async buscarVeiculo(req, res) {
    try {
      const { id } = req.params;

      const veiculo = await Vehicle.findById(id)
        .populate('vendedor', 'nome email')
        .populate('comprador', 'nome email');
      
      if (!veiculo) {
        return res.status(404).json({
          erro: 'Veículo não encontrado',
          codigo: 'VEHICLE_NOT_FOUND'
        });
      }

      res.json({
        veiculo: veiculo.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao buscar veículo:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // PUT /vehicles/:id - Atualizar veículo (Vendedor do veículo, Admin)
  async atualizarVeiculo(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      // Validação dos dados de atualização
      const { error } = Vehicle.validarAtualizacao(dadosAtualizacao);
      if (error) {
        return res.status(400).json({
          erro: 'Dados inválidos',
          detalhes: error.details.map(detail => detail.message),
          codigo: 'VALIDATION_ERROR'
        });
      }

      // Buscar veículo (já verificado pelo middleware)
      const veiculo = req.veiculo;

      // Não permitir alterar status para vendido via esta rota
      if (dadosAtualizacao.status === 'vendido') {
        return res.status(400).json({
          erro: 'Não é possível alterar status para vendido via esta rota',
          codigo: 'INVALID_STATUS_CHANGE'
        });
      }

      // Atualizar veículo
      Object.assign(veiculo, dadosAtualizacao);
      await veiculo.save();

      logger.info(`Veículo atualizado: ${veiculo.marca} ${veiculo.modelo} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Veículo atualizado com sucesso',
        veiculo: veiculo.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao atualizar veículo:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // DELETE /vehicles/:id - Remover veículo (Vendedor do veículo, Admin)
  async removerVeiculo(req, res) {
    try {
      const veiculo = req.veiculo;

      // Não permitir remover veículos vendidos
      if (veiculo.status === 'vendido') {
        return res.status(400).json({
          erro: 'Não é possível remover veículos vendidos',
          codigo: 'CANNOT_DELETE_SOLD_VEHICLE'
        });
      }

      await Vehicle.findByIdAndDelete(veiculo._id);

      logger.info(`Veículo removido: ${veiculo.marca} ${veiculo.modelo} por ${req.usuario.email}`);

      res.json({
        mensagem: 'Veículo removido com sucesso'
      });

    } catch (error) {
      logger.error('Erro ao remover veículo:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /vehicles/my - Listar veículos do usuário logado
  async listarMeusVeiculos(req, res) {
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
        sort: { createdAt: -1 },
        populate: {
          path: 'comprador',
          select: 'nome email'
        }
      };

      const resultado = await Vehicle.paginate(filtros, opcoes);

      res.json({
        veiculos: resultado.docs,
        paginacao: {
          pagina: resultado.page,
          totalPaginas: resultado.totalPages,
          totalVeiculos: resultado.totalDocs,
          veiculosPorPagina: resultado.limit
        }
      });

    } catch (error) {
      logger.error('Erro ao listar meus veículos:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }

  // POST /vehicles/:id/sell - Marcar veículo como vendido (para integração com orders-service)
  async marcarComoVendido(req, res) {
    try {
      const { id } = req.params;
      const { compradorId } = req.body;

      const veiculo = await Vehicle.findById(id);
      if (!veiculo) {
        return res.status(404).json({
          erro: 'Veículo não encontrado',
          codigo: 'VEHICLE_NOT_FOUND'
        });
      }

      if (veiculo.status === 'vendido') {
        return res.status(400).json({
          erro: 'Veículo já foi vendido',
          codigo: 'VEHICLE_ALREADY_SOLD'
        });
      }

      await veiculo.marcarComoVendido(compradorId);

      logger.info(`Veículo marcado como vendido: ${veiculo.marca} ${veiculo.modelo} para comprador ${compradorId}`);

      res.json({
        mensagem: 'Veículo marcado como vendido com sucesso',
        veiculo: veiculo.toPublicJSON()
      });

    } catch (error) {
      logger.error('Erro ao marcar veículo como vendido:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = new VehicleController(); 