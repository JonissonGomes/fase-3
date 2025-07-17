import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Car, 
  Users, 
  ShoppingCart, 
  LogOut, 
  Plus, 
  Eye, 
  Settings,
  TrendingUp,
  DollarSign,
  Package,
  User,
  Building,
  Shield
} from 'lucide-react';
import { vehiclesService, ordersService, authService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout, isAdmin, isVendedor, isCliente } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Carregar estatísticas baseadas no perfil
      if (isAdmin()) {
        const [vehiclesRes, ordersRes, usersRes] = await Promise.all([
          vehiclesService.getVehicles(),
          ordersService.getOrders(),
          authService.getUsers()
        ]);
        
        setStats({
          totalVehicles: vehiclesRes.data.veiculos?.length || 0,
          totalOrders: ordersRes.data.pedidos?.length || 0,
          totalUsers: usersRes.data.usuarios?.length || 0,
          totalSales: ordersRes.data.pedidos?.filter(p => p.status === 'aprovado').length || 0
        });
      } else if (isVendedor()) {
        const [myVehiclesRes, soldVehiclesRes] = await Promise.all([
          vehiclesService.getMyVehicles(),
          vehiclesService.getSoldVehicles()
        ]);
        
        setStats({
          totalVehicles: myVehiclesRes.data.veiculos?.length || 0,
          totalOrders: 0,
          totalUsers: 0,
          totalSales: soldVehiclesRes.data.veiculos?.length || 0
        });
      } else if (isCliente()) {
        const [vehiclesRes, myOrdersRes] = await Promise.all([
          vehiclesService.getVehicles(),
          ordersService.getMyOrders()
        ]);
        
        setStats({
          totalVehicles: vehiclesRes.data.veiculos?.length || 0,
          totalOrders: myOrdersRes.data.pedidos?.length || 0,
          totalUsers: 0,
          totalSales: 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardTitle = () => {
    if (isAdmin()) return 'Dashboard Administrativo';
    if (isVendedor()) return 'Dashboard do Vendedor';
    if (isCliente()) return 'Dashboard do Cliente';
    return 'Dashboard';
  };

  const getNavigationItems = () => {
    const items = [];

    if (isAdmin()) {
      items.push(
        { 
          name: 'Gerenciar Usuários', 
          icon: Users, 
          href: '/users', 
          color: 'bg-blue-500',
          description: 'Visualizar e gerenciar todos os usuários do sistema'
        },
        { 
          name: 'Gerenciar Pedidos', 
          icon: ShoppingCart, 
          href: '/orders', 
          color: 'bg-green-500',
          description: 'Aprovar ou rejeitar pedidos de compra'
        },
        { 
          name: 'Gerenciar Veículos', 
          icon: Car, 
          href: '/vehicles', 
          color: 'bg-purple-500',
          description: 'Visualizar todos os veículos cadastrados'
        }
      );
    } else if (isVendedor()) {
      items.push(
        { 
          name: 'Meus Veículos', 
          icon: Car, 
          href: '/vehicles', 
          color: 'bg-purple-500',
          description: 'Gerenciar seus veículos cadastrados'
        },
        { 
          name: 'Novo Veículo', 
          icon: Plus, 
          href: '/vehicles/new', 
          color: 'bg-green-500',
          description: 'Cadastrar um novo veículo para venda'
        }
      );
    } else if (isCliente()) {
      items.push(
        { 
          name: 'Ver Veículos', 
          icon: Eye, 
          href: '/vehicles', 
          color: 'bg-blue-500',
          description: 'Visualizar veículos disponíveis para compra'
        },
        { 
          name: 'Meus Pedidos', 
          icon: ShoppingCart, 
          href: '/orders', 
          color: 'bg-green-500',
          description: 'Acompanhar status dos seus pedidos'
        }
      );
    }

    return items;
  };

  const getStatsCards = () => {
    const cards = [];

    if (isAdmin()) {
      cards.push(
        { name: 'Total de Veículos', value: stats.totalVehicles, icon: Car, color: 'bg-blue-500' },
        { name: 'Total de Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-500' },
        { name: 'Total de Usuários', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
        { name: 'Vendas Aprovadas', value: stats.totalSales, icon: TrendingUp, color: 'bg-yellow-500' }
      );
    } else if (isVendedor()) {
      cards.push(
        { name: 'Meus Veículos', value: stats.totalVehicles, icon: Car, color: 'bg-blue-500' },
        { name: 'Veículos Vendidos', value: stats.totalSales, icon: DollarSign, color: 'bg-green-500' }
      );
    } else if (isCliente()) {
      cards.push(
        { name: 'Veículos Disponíveis', value: stats.totalVehicles, icon: Car, color: 'bg-blue-500' },
        { name: 'Meus Pedidos', value: stats.totalOrders, icon: Package, color: 'bg-green-500' }
      );
    }

    return cards;
  };

  const getProfileInfo = () => {
    const profileConfig = {
      admin: { icon: Shield, color: 'bg-red-100 text-red-600', name: 'Administrador' },
      vendedor: { icon: Building, color: 'bg-blue-100 text-blue-600', name: 'Vendedor' },
      cliente: { icon: User, color: 'bg-green-100 text-green-600', name: 'Cliente' }
    };

    const config = profileConfig[user?.perfil?.toLowerCase()] || profileConfig.cliente;
    const Icon = config.icon;

    return { config, Icon };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    );
  }

  const { config: profileConfig, Icon: ProfileIcon } = getProfileInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-content">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="page-title">
                {getDashboardTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${profileConfig.color}`}>
                  <ProfileIcon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
                  <p className="text-xs text-gray-500 capitalize">{profileConfig.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="content-max-width section-spacing container-padding">
        {/* Cards de Estatísticas */}
        <div className="grid-cards mb-8">
          {getStatsCards().map((card, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navegação Rápida */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Navegação Rápida</h3>
            <p className="card-subtitle">
              Acesse rapidamente as principais funcionalidades do sistema
            </p>
          </div>
          <div className="grid-responsive">
            {getNavigationItems().map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="list-item hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 p-3 rounded-md ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Informações do Perfil */}
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="card-title">Informações do Perfil</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nome:</span> {user?.nome}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              {user?.cpf && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">CPF:</span> {user.cpf}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Perfil:</span> {profileConfig.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Cadastrado em:</span> {user?.createdAt ? 
                  new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 