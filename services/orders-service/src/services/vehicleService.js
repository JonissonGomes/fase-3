const axios = require('axios');
const logger = require('../config/logger');

class VehicleService {
  constructor() {
    this.baseURL = process.env.VEHICLES_SERVICE_URL || 'http://localhost:3002';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Buscar veículo por ID
  async buscarVeiculo(veiculoId) {
    try {
      const response = await this.client.get(`/vehicles/${veiculoId}`);
      return response.data.veiculo;
    } catch (error) {
      logger.error(`Erro ao buscar veículo ${veiculoId}:`, error.message);
      throw new Error(`Veículo não encontrado: ${error.message}`);
    }
  }

  // Verificar se veículo está disponível para compra
  async verificarDisponibilidade(veiculoId) {
    try {
      const veiculo = await this.buscarVeiculo(veiculoId);
      
      if (veiculo.status !== 'à venda') {
        throw new Error(`Veículo não está disponível para compra. Status: ${veiculo.status}`);
      }
      
      return veiculo;
    } catch (error) {
      logger.error(`Erro ao verificar disponibilidade do veículo ${veiculoId}:`, error.message);
      throw error;
    }
  }

  // Marcar veículo como vendido
  async marcarComoVendido(veiculoId, compradorId) {
    try {
      const response = await this.client.post(`/vehicles/${veiculoId}/sell`, {
        compradorId
      });
      
      logger.info(`Veículo ${veiculoId} marcado como vendido para comprador ${compradorId}`);
      return response.data.veiculo;
    } catch (error) {
      logger.error(`Erro ao marcar veículo ${veiculoId} como vendido:`, error.message);
      throw new Error(`Erro ao processar venda do veículo: ${error.message}`);
    }
  }

  // Verificar se veículo existe e está à venda
  async validarVeiculoParaCompra(veiculoId) {
    try {
      const veiculo = await this.verificarDisponibilidade(veiculoId);
      return {
        id: veiculo._id,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        preco: veiculo.preco,
        vendedor: veiculo.vendedor
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new VehicleService(); 