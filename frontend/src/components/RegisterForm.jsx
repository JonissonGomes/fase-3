import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Car, User, Building, Shield, AlertCircle } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'cliente',
    cpf: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validação de nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de CPF para clientes
    if (formData.perfil === 'cliente') {
      if (!formData.cpf.trim()) {
        newErrors.cpf = 'CPF é obrigatório para clientes';
      } else if (!validateCPF(formData.cpf.replace(/\D/g, ''))) {
        newErrors.cpf = 'CPF inválido';
      }
    }

    // Validação de senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCPF = (cpf) => {
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Preparar dados para envio
    const userData = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      senha: formData.senha,
      perfil: formData.perfil
    };

    // Adicionar CPF apenas se for cliente
    if (formData.perfil === 'cliente' && formData.cpf) {
      userData.cpf = formData.cpf.replace(/\D/g, '');
    }

    const result = await register(userData);
    
    if (result.success) {
      navigate('/login');
    }
    
    setLoading(false);
  };

  const getPerfilIcon = (perfil) => {
    switch (perfil) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'vendedor':
        return <Building className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getPerfilColor = (perfil) => {
    switch (perfil) {
      case 'admin':
        return 'bg-red-100 text-red-600';
      case 'vendedor':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-green-100 text-green-600';
    }
  };

  const getPerfilDescription = (perfil) => {
    switch (perfil) {
      case 'admin':
        return 'Acesso completo ao sistema';
      case 'vendedor':
        return 'Gerenciar veículos e vendas';
      default:
        return 'Comprar veículos';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <Car className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              faça login aqui
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className={`input-field ${errors.nome ? 'border-red-500' : ''}`}
                placeholder="Seu nome completo"
              />
              {errors.nome && (
                <p className="form-error flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.nome}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="form-error flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="perfil" className="form-label">
                Tipo de Conta
              </label>
              <select
                id="perfil"
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
                className="input-field"
              >
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {formData.perfil === 'cliente' && (
              <div className="form-group">
                <label htmlFor="cpf" className="form-label">
                  CPF <span className="text-red-500">*</span>
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`input-field ${errors.cpf ? 'border-red-500' : ''}`}
                  placeholder="000.000.000-00"
                  maxLength="14"
                />
                {errors.cpf && (
                  <p className="form-error flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cpf}
                  </p>
                )}
                <p className="form-help">
                  CPF é obrigatório para realizar compras
                </p>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className={`input-field pr-10 ${errors.senha ? 'border-red-500' : ''}`}
                  placeholder="Sua senha"
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="form-error flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.senha}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${getPerfilColor(formData.perfil)}`}>
                {getPerfilIcon(formData.perfil)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formData.perfil.charAt(0).toUpperCase() + formData.perfil.slice(1)}
                </p>
                <p className="text-xs text-gray-500">
                  {getPerfilDescription(formData.perfil)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm; 