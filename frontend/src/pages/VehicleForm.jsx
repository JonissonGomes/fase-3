import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { vehiclesService } from '../services/api';
import { Car, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    quilometragem: '',
    combustivel: 'gasolina',
    transmissao: 'manual',
    preco: '',
    descricao: '',
    status: 'disponivel'
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const response = await vehiclesService.getVehicle(id);
      const vehicle = response.data.veiculo;
      
      setFormData({
        marca: vehicle.marca || '',
        modelo: vehicle.modelo || '',
        ano: vehicle.ano || '',
        cor: vehicle.cor || '',
        quilometragem: vehicle.quilometragem || '',
        combustivel: vehicle.combustivel || 'gasolina',
        transmissao: vehicle.transmissao || 'manual',
        preco: vehicle.preco || '',
        descricao: vehicle.descricao || '',
        status: vehicle.status || 'disponivel'
      });
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
      toast.error('Erro ao carregar dados do veículo');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validar campos obrigatórios
      const requiredFields = ['marca', 'modelo', 'ano', 'cor', 'quilometragem', 'preco'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Preencha os campos obrigatórios: ${missingFields.join(', ')}`);
        return;
      }

      // Preparar dados
      const vehicleData = {
        ...formData,
        quilometragem: parseInt(formData.quilometragem),
        preco: parseFloat(formData.preco),
        ano: parseInt(formData.ano)
      };

      if (isEditing) {
        await vehiclesService.updateVehicle(id, vehicleData);
        toast.success('Veículo atualizado com sucesso!');
      } else {
        await vehiclesService.createVehicle(vehicleData);
        toast.success('Veículo cadastrado com sucesso!');
      }

      navigate('/vehicles');
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      const message = error.response?.data?.erro || 'Erro ao salvar veículo';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/vehicles" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <Car className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
                    Marca *
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    required
                    value={formData.marca}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Ex: Toyota"
                  />
                </div>

                <div>
                  <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    required
                    value={formData.modelo}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Ex: Corolla"
                  />
                </div>

                <div>
                  <label htmlFor="ano" className="block text-sm font-medium text-gray-700">
                    Ano *
                  </label>
                  <input
                    type="number"
                    id="ano"
                    name="ano"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.ano}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Ex: 2020"
                  />
                </div>

                <div>
                  <label htmlFor="cor" className="block text-sm font-medium text-gray-700">
                    Cor *
                  </label>
                  <input
                    type="text"
                    id="cor"
                    name="cor"
                    required
                    value={formData.cor}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Ex: Prata"
                  />
                </div>
              </div>
            </div>

            {/* Especificações */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Especificações
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quilometragem" className="block text-sm font-medium text-gray-700">
                    Quilometragem (km) *
                  </label>
                  <input
                    type="number"
                    id="quilometragem"
                    name="quilometragem"
                    required
                    min="0"
                    value={formData.quilometragem}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Ex: 50000"
                  />
                </div>

                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="preco"
                    name="preco"
                    required
                    min="0"
                    step="0.01"
                    value={formData.preco}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Ex: 45000.00"
                  />
                </div>

                <div>
                  <label htmlFor="combustivel" className="block text-sm font-medium text-gray-700">
                    Combustível
                  </label>
                  <select
                    id="combustivel"
                    name="combustivel"
                    value={formData.combustivel}
                    onChange={handleChange}
                    className="input-field mt-1"
                  >
                    <option value="gasolina">Gasolina</option>
                    <option value="etanol">Etanol</option>
                    <option value="flex">Flex</option>
                    <option value="diesel">Diesel</option>
                    <option value="eletrico">Elétrico</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transmissao" className="block text-sm font-medium text-gray-700">
                    Transmissão
                  </label>
                  <select
                    id="transmissao"
                    name="transmissao"
                    value={formData.transmissao}
                    onChange={handleChange}
                    className="input-field mt-1"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatico">Automático</option>
                    <option value="cvt">CVT</option>
                    <option value="semi-automatico">Semi-automático</option>
                  </select>
                </div>

                {isEditing && (
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input-field mt-1"
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="vendido">Vendido</option>
                      <option value="reservado">Reservado</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={formData.descricao}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Descreva as características especiais do veículo..."
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/vehicles"
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm; 