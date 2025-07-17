import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersService, vehiclesService } from '../services/api';
import { ShoppingCart, Check, X, Clock, DollarSign, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersList = () => {
  const { user, isAdmin, isCliente } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let response;

      if (isAdmin()) {
        response = await ordersService.getOrders();
      } else {
        response = await ordersService.getMyOrders();
      }

      const ordersData = response.data.pedidos || [];
      setOrders(ordersData);

      // Carregar dados dos veículos
      const vehicleIds = [...new Set(ordersData.map(order => order.veiculoId))];
      const vehiclesData = {};
      
      for (const vehicleId of vehicleIds) {
        try {
          const vehicleResponse = await vehiclesService.getVehicle(vehicleId);
          vehiclesData[vehicleId] = vehicleResponse.data.veiculo;
        } catch (error) {
          console.error(`Erro ao carregar veículo ${vehicleId}:`, error);
        }
      }
      
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }

    setFilteredOrders(filtered);
  };

  const handleApprove = async (orderId) => {
    if (!window.confirm('Confirmar aprovação deste pedido?')) {
      return;
    }

    try {
      await ordersService.approveOrder(orderId);
      toast.success('Pedido aprovado com sucesso!');
      loadOrders();
    } catch (error) {
      toast.error('Erro ao aprovar pedido');
    }
  };

  const handleReject = async (orderId) => {
    if (!window.confirm('Confirmar rejeição deste pedido?')) {
      return;
    }

    try {
      await ordersService.rejectOrder(orderId);
      toast.success('Pedido rejeitado com sucesso!');
      loadOrders();
    } catch (error) {
      toast.error('Erro ao rejeitar pedido');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendente': { 
        color: 'status-pending', 
        text: 'Pendente',
        icon: Clock
      },
      'aprovado': { 
        color: 'status-approved', 
        text: 'Aprovado',
        icon: Check
      },
      'rejeitado': { 
        color: 'status-rejected', 
        text: 'Rejeitado',
        icon: X
      }
    };

    const config = statusConfig[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      text: status,
      icon: Clock
    };

    const Icon = config.icon;

    return (
      <span className={`status-badge ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
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
              <ShoppingCart className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="page-title">
                {isAdmin() ? 'Gerenciar Pedidos' : 'Meus Pedidos'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="content-max-width section-spacing container-padding">
        {/* Filtros */}
        <div className="filter-container">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por Status</h3>
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={`filter-button ${
                filter === 'all' ? 'filter-button-active' : 'filter-button-inactive'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('pendente')}
              className={`filter-button ${
                filter === 'pendente' ? 'filter-button-active' : 'filter-button-inactive'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter('aprovado')}
              className={`filter-button ${
                filter === 'aprovado' ? 'filter-button-active' : 'filter-button-inactive'
              }`}
            >
              Aprovados
            </button>
            <button
              onClick={() => setFilter('rejeitado')}
              className={`filter-button ${
                filter === 'rejeitado' ? 'filter-button-active' : 'filter-button-inactive'
              }`}
            >
              Rejeitados
            </button>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="list-container">
          {filteredOrders.map((order) => {
            const vehicle = vehicles[order.veiculoId];
            
            return (
              <div key={order.id} className="list-item">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Criado em {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {vehicle && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Veículo: {vehicle.marca} {vehicle.modelo} ({vehicle.ano})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Cor:</span> {vehicle.cor}
                      </div>
                      <div>
                        <span className="font-medium">Quilometragem:</span> {vehicle.quilometragem?.toLocaleString()} km
                      </div>
                      <div>
                        <span className="font-medium">Combustível:</span> {vehicle.combustivel}
                      </div>
                      <div>
                        <span className="font-medium">Preço:</span> {formatPrice(vehicle.preco)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {isAdmin() && (
                      <>
                        <p><span className="font-medium">Cliente:</span> {order.cliente?.nome || 'N/A'}</p>
                        <p><span className="font-medium">Email:</span> {order.cliente?.email || 'N/A'}</p>
                        {order.cliente?.cpf && (
                          <p><span className="font-medium">CPF:</span> {order.cliente.cpf}</p>
                        )}
                      </>
                    )}
                    {isCliente() && (
                      <p><span className="font-medium">Status:</span> {order.status === 'pendente' ? 'Aguardando aprovação' : 
                        order.status === 'aprovado' ? 'Aprovado - Venda confirmada' : 'Rejeitado'}</p>
                    )}
                  </div>
                  
                  {isAdmin() && order.status === 'pendente' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="btn-success flex items-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Aprovar</span>
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="btn-danger flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <ShoppingCart className="empty-state-icon" />
            <h3 className="empty-state-title">
              Nenhum pedido encontrado
            </h3>
            <p className="empty-state-description">
              {isAdmin() 
                ? 'Não há pedidos para gerenciar.' 
                : 'Você ainda não fez nenhum pedido.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList; 