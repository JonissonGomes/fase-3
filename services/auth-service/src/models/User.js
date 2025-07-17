const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    trim: true,
    match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX']
  },
  perfil: {
    type: String,
    enum: ['Cliente', 'Vendedor', 'Admin'],
    default: 'Cliente',
    required: true
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  ultimoLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Plugin de paginação
userSchema.plugin(mongoosePaginate);

// Índices para otimização de consultas
userSchema.index({ email: 1 });
userSchema.index({ cpf: 1 });
userSchema.index({ perfil: 1 });
userSchema.index({ ativo: 1 });

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

// Método para gerar token JWT
userSchema.methods.gerarToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      perfil: this.perfil 
    },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '24h' }
  );
};

// Método para retornar dados públicos do usuário
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.senha;
  return user;
};

// Validação Joi para entrada de dados
const userValidationSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required(),
  perfil: Joi.string().valid('Cliente', 'Vendedor', 'Admin').default('Cliente')
});

const userUpdateValidationSchema = Joi.object({
  nome: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  perfil: Joi.string().valid('Cliente', 'Vendedor', 'Admin'),
  ativo: Joi.boolean()
});

// Métodos estáticos
userSchema.statics.validarDados = function(dados) {
  return userValidationSchema.validate(dados);
};

userSchema.statics.validarAtualizacao = function(dados) {
  return userUpdateValidationSchema.validate(dados);
};

// Método para buscar usuário por email
userSchema.statics.buscarPorEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), ativo: true });
};

// Método para buscar usuário por CPF
userSchema.statics.buscarPorCPF = function(cpf) {
  return this.findOne({ cpf, ativo: true });
};

module.exports = mongoose.model('User', userSchema); 