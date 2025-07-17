const mongoose = require('mongoose');
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new mongoose.Schema({
  veiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  comprador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  precoFinal: {
    type: Number,
    required: true,
    min: [0, 'Preço final deve ser maior ou igual a zero']
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado', 'concluído', 'cancelado'],
    default: 'pendente',
    required: true
  },
  dataCompra: {
    type: Date,
    default: Date.now
  },
  dataAprovacao: {
    type: Date
  },
  dataConclusao: {
    type: Date
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações não podem exceder 500 caracteres']
  },
  metodoPagamento: {
    type: String,
    enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia'],
    default: 'dinheiro'
  },
  parcelas: {
    type: Number,
    min: [1, 'Número de parcelas deve ser pelo menos 1'],
    max: [12, 'Número de parcelas não pode exceder 12']
  },
  valorParcela: {
    type: Number,
    min: [0, 'Valor da parcela deve ser maior ou igual a zero']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Plugin de paginação
orderSchema.plugin(mongoosePaginate);

// Índices para otimização de consultas
orderSchema.index({ comprador: 1 });
orderSchema.index({ vendedor: 1 });
orderSchema.index({ veiculo: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ dataCompra: -1 });
orderSchema.index({ createdAt: -1 });

// Índices compostos
orderSchema.index({ comprador: 1, status: 1 });
orderSchema.index({ vendedor: 1, status: 1 });

// Virtual para calcular valor total das parcelas
orderSchema.virtual('valorTotalParcelas').get(function() {
  if (this.parcelas && this.valorParcela) {
    return this.parcelas * this.valorParcela;
  }
  return this.precoFinal;
});

// Virtual para preço formatado
orderSchema.virtual('precoFormatado').get(function() {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(this.precoFinal);
});

// Virtual para valor da parcela formatado
orderSchema.virtual('valorParcelaFormatado').get(function() {
  if (this.valorParcela) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valorParcela);
  }
  return null;
});

// Método para aprovar pedido
orderSchema.methods.aprovar = function() {
  this.status = 'aprovado';
  this.dataAprovacao = new Date();
  return this.save();
};

// Método para rejeitar pedido
orderSchema.methods.rejeitar = function(observacoes) {
  this.status = 'rejeitado';
  if (observacoes) {
    this.observacoes = observacoes;
  }
  return this.save();
};

// Método para concluir pedido
orderSchema.methods.concluir = function() {
  this.status = 'concluído';
  this.dataConclusao = new Date();
  return this.save();
};

// Método para cancelar pedido
orderSchema.methods.cancelar = function(observacoes) {
  this.status = 'cancelado';
  if (observacoes) {
    this.observacoes = observacoes;
  }
  return this.save();
};

// Método para retornar dados públicos
orderSchema.methods.toPublicJSON = function() {
  const order = this.toObject();
  return order;
};

// Validação Joi para entrada de dados
const orderValidationSchema = Joi.object({
  veiculoId: Joi.string().required(),
  precoFinal: Joi.number().min(0).required(),
  observacoes: Joi.string().max(500).optional(),
  metodoPagamento: Joi.string().valid('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia').default('dinheiro'),
  parcelas: Joi.number().min(1).max(12).optional(),
  valorParcela: Joi.number().min(0).optional()
});

const orderUpdateValidationSchema = Joi.object({
  status: Joi.string().valid('pendente', 'aprovado', 'rejeitado', 'concluído', 'cancelado'),
  observacoes: Joi.string().max(500),
  metodoPagamento: Joi.string().valid('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia'),
  parcelas: Joi.number().min(1).max(12),
  valorParcela: Joi.number().min(0)
});

// Métodos estáticos
orderSchema.statics.validarDados = function(dados) {
  return orderValidationSchema.validate(dados);
};

orderSchema.statics.validarAtualizacao = function(dados) {
  return orderUpdateValidationSchema.validate(dados);
};

// Método para buscar pedidos por comprador
orderSchema.statics.buscarPorComprador = function(compradorId) {
  return this.find({ comprador: compradorId }).sort({ dataCompra: -1 });
};

// Método para buscar pedidos por vendedor
orderSchema.statics.buscarPorVendedor = function(vendedorId) {
  return this.find({ vendedor: vendedorId }).sort({ dataCompra: -1 });
};

// Método para buscar pedidos por status
orderSchema.statics.buscarPorStatus = function(status) {
  return this.find({ status }).sort({ dataCompra: -1 });
};

// Método para buscar pedidos por veículo
orderSchema.statics.buscarPorVeiculo = function(veiculoId) {
  return this.find({ veiculo: veiculoId }).sort({ dataCompra: -1 });
};

module.exports = mongoose.model('Order', orderSchema); 