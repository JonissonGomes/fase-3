import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vehiclesService, ordersService } from '../services/api';
import { Car, Plus, Edit, Trash2, ShoppingCart, Eye, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const VehiclesList = () => {
  const { user, isAdmin, isVendedor, isCliente } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSold, setShowSold] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    loadVehicles();
  }, [showSold]);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchTerm, statusFilter, priceFilter]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      let response;

      if (isVendedor() || isAdmin()) {
        if (showSold) {
          response = await vehiclesService.getSoldVehicles();
        } else {
          response = await vehiclesService.getMyVehicles();
        }
      } else {
        response = await vehiclesService.getVehicles();
      }

      setVehicles(response.data.veiculos || []);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) {
      return;
    }

    try {
      await vehiclesService.deleteVehicle(id);
      toast.success('Veículo excluído com sucesso!');
      loadVehicles();
    } catch (error) {
      toast.error('Erro ao excluir veículo');
    }
  };

  const handlePurchase = async (vehicleId) => {
    if (!user?.cpf) {
      toast.error('CPF é obrigatório para realizar compras. Atualize seu perfil.');
      return;
    }

    if (!window.confirm('Confirmar compra deste veículo?')) {
      return;
    }

    try {
      await ordersService.createOrder({
        veiculoId: vehicleId,
        clienteId: user.id
      });
      toast.success('Pedido criado com sucesso! Aguardando aprovação.');
      // Recarregar veículos para atualizar status
      loadVehicles();
    } catch (error) {
      const message = error.response?.data?.erro || 'Erro ao criar pedido';
      toast.error(message);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.cor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.ano?.toString().includes(searchTerm)
      );
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    // Filtro de preço
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(vehicle => vehicle.preco <= 30000);
          break;
        case 'medium':
          filtered = filtered.filter(vehicle => vehicle.preco > 30000 && vehicle.preco <= 80000);
          break;
        case 'high':
          filtered = filtered.filter(vehicle => vehicle.preco > 80000);
          break;
        default:
          break;
      }
    }

    setFilteredVehicles(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'disponivel': { color: 'status-available', text: 'Disponível' },
      'vendido': { color: 'status-sold', text: 'Vendido' },
      'reservado': { color: 'status-reserved', text: 'Reservado' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };

    return (
      <span className={`status-badge ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-content">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="page-title">
                {isVendedor() || isAdmin() ? 'Meus Veículos' : 'Veículos Disponíveis'}
              </h1>
            </div>
            {(isVendedor() || isAdmin()) && (
              <Link
                to="/vehicles/new"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Novo Veículo</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="content-max-width section-spacing container-padding">
        {/* Filtros para Vendedores/Admin */}
        {(isVendedor() || isAdmin()) && (
          <div className="filter-container">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por Status</h3>
            <div className="filter-buttons">
              <button
                onClick={() => setShowSold(false)}
                className={`filter-button ${
                  !showSold ? 'filter-button-active' : 'filter-button-inactive'
                }`}
              >
                Disponíveis
              </button>
              <button
                onClick={() => setShowSold(true)}
                className={`filter-button ${
                  showSold ? 'filter-button-active' : 'filter-button-inactive'
                }`}
              >
                Vendidos
              </button>
            </div>
          </div>
        )}

        {/* Filtros para Clientes */}
        {isCliente() && (
          <div className="filter-container">
            <div className="space-y-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo, cor ou ano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro de Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="disponivel">Disponível</option>
                    <option value="reservado">Reservado</option>
                  </select>
                </div>

                {/* Filtro de Preço */}
                <div className="form-group">
                  <label className="form-label">Faixa de Preço</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Todas as Faixas</option>
                    <option value="low">Até R$ 30.000</option>
                    <option value="medium">R$ 30.000 - R$ 80.000</option>
                    <option value="high">Acima de R$ 80.000</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Veículos */}
        <div className="grid-responsive">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="list-item">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.marca} {vehicle.modelo}
                  </h3>
                  <p className="text-sm text-gray-500">{vehicle.ano}</p>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Cor:</span> {vehicle.cor}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Quilometragem:</span> {vehicle.quilometragem?.toLocaleString()} km
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Combustível:</span> {vehicle.combustivel}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transmissão:</span> {vehicle.transmissao}
                </p>
                {vehicle.descricao && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Descrição:</span> {vehicle.descricao}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-primary-600">
                  {formatPrice(vehicle.preco)}
                </div>
                
                <div className="flex space-x-2">
                  {isCliente() && vehicle.status === 'disponivel' && (
                    <button
                      onClick={() => handlePurchase(vehicle.id)}
                      className="btn-primary flex items-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Comprar</span>
                    </button>
                  )}
                  
                  {(isVendedor() || isAdmin()) && (
                    <>
                      <Link
                        to={`/vehicles/edit/${vehicle.id}`}
                        className="btn-secondary flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="btn-danger flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="empty-state">
            <Car className="empty-state-icon" />
            <h3 className="empty-state-title">
              Nenhum veículo encontrado
            </h3>
            <p className="empty-state-description">
              {isVendedor() || isAdmin() 
                ? 'Comece adicionando um novo veículo.' 
                : 'Não há veículos disponíveis com os filtros selecionados.'
              }
            </p>
            {(isVendedor() || isAdmin()) && (
              <div className="mt-6">
                <Link to="/vehicles/new" className="btn-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Veículo
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesList; 