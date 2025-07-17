const mongoose = require('mongoose');
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');

const vehicleSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, 'Marca é obrigatória'],
    trim: true,
    minlength: [2, 'Marca deve ter pelo menos 2 caracteres'],
    maxlength: [50, 'Marca não pode exceder 50 caracteres']
  },
  modelo: {
    type: String,
    required: [true, 'Modelo é obrigatório'],
    trim: true,
    minlength: [2, 'Modelo deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Modelo não pode exceder 100 caracteres']
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    min: [1900, 'Ano deve ser maior que 1900'],
    max: [new Date().getFullYear() + 1, 'Ano não pode ser maior que o próximo ano']
  },
  cor: {
    type: String,
    required: [true, 'Cor é obrigatória'],
    trim: true,
    minlength: [2, 'Cor deve ter pelo menos 2 caracteres'],
    maxlength: [30, 'Cor não pode exceder 30 caracteres']
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço deve ser maior ou igual a zero']
  },
  status: {
    type: String,
    enum: ['à venda', 'vendido'],
    default: 'à venda',
    required: true
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [1000, 'Descrição não pode exceder 1000 caracteres']
  },
  quilometragem: {
    type: Number,
    min: [0, 'Quilometragem deve ser maior ou igual a zero']
  },
  combustivel: {
    type: String,
    enum: ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'],
    default: 'Flex'
  },
  transmissao: {
    type: String,
    enum: ['Manual', 'Automático', 'CVT'],
    default: 'Manual'
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagens: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL da imagem deve ser válida'
    }
  }],
  dataVenda: {
    type: Date
  },
  comprador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Plugin de paginação
vehicleSchema.plugin(mongoosePaginate);

// Índices para otimização de consultas
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ preco: 1 });
vehicleSchema.index({ marca: 1, modelo: 1 });
vehicleSchema.index({ vendedor: 1 });
vehicleSchema.index({ ano: -1 });
vehicleSchema.index({ createdAt: -1 });

// Índice composto para busca por status e preço
vehicleSchema.index({ status: 1, preco: 1 });

// Virtual para idade do veículo
vehicleSchema.virtual('idade').get(function() {
  return new Date().getFullYear() - this.ano;
});

// Virtual para preço formatado
vehicleSchema.virtual('precoFormatado').get(function() {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(this.preco);
});

// Método para marcar como vendido
vehicleSchema.methods.marcarComoVendido = function(compradorId) {
  this.status = 'vendido';
  this.dataVenda = new Date();
  this.comprador = compradorId;
  return this.save();
};

// Método para retornar dados públicos
vehicleSchema.methods.toPublicJSON = function() {
  const vehicle = this.toObject();
  // Remover campos sensíveis se necessário
  return vehicle;
};

// Validação Joi para entrada de dados
const vehicleValidationSchema = Joi.object({
  marca: Joi.string().min(2).max(50).required(),
  modelo: Joi.string().min(2).max(100).required(),
  ano: Joi.number().min(1900).max(new Date().getFullYear() + 1).required(),
  cor: Joi.string().min(2).max(30).required(),
  preco: Joi.number().min(0).required(),
  descricao: Joi.string().max(1000).optional(),
  quilometragem: Joi.number().min(0).optional(),
  combustivel: Joi.string().valid('Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido').default('Flex'),
  transmissao: Joi.string().valid('Manual', 'Automático', 'CVT').default('Manual'),
  imagens: Joi.array().items(Joi.string().uri()).optional()
});

const vehicleUpdateValidationSchema = Joi.object({
  marca: Joi.string().min(2).max(50),
  modelo: Joi.string().min(2).max(100),
  ano: Joi.number().min(1900).max(new Date().getFullYear() + 1),
  cor: Joi.string().min(2).max(30),
  preco: Joi.number().min(0),
  descricao: Joi.string().max(1000),
  quilometragem: Joi.number().min(0),
  combustivel: Joi.string().valid('Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'),
  transmissao: Joi.string().valid('Manual', 'Automático', 'CVT'),
  imagens: Joi.array().items(Joi.string().uri()),
  status: Joi.string().valid('à venda', 'vendido')
});

// Métodos estáticos
vehicleSchema.statics.validarDados = function(dados) {
  return vehicleValidationSchema.validate(dados);
};

vehicleSchema.statics.validarAtualizacao = function(dados) {
  return vehicleUpdateValidationSchema.validate(dados);
};

// Método para buscar veículos à venda ordenados por preço
vehicleSchema.statics.buscarAVenda = function(filtros = {}) {
  const query = { status: 'à venda', ...filtros };
  return this.find(query).sort({ preco: 1 });
};

// Método para buscar veículos vendidos ordenados por preço
vehicleSchema.statics.buscarVendidos = function(filtros = {}) {
  const query = { status: 'vendido', ...filtros };
  return this.find(query).sort({ preco: 1 });
};

// Método para buscar veículos por vendedor
vehicleSchema.statics.buscarPorVendedor = function(vendedorId) {
  return this.find({ vendedor: vendedorId }).sort({ createdAt: -1 });
};

// Método para buscar veículos por comprador
vehicleSchema.statics.buscarPorComprador = function(compradorId) {
  return this.find({ comprador: compradorId }).sort({ dataVenda: -1 });
};

module.exports = mongoose.model('Vehicle', vehicleSchema); 