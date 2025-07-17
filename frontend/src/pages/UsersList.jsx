import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { Users, User, Building, Shield, Mail, Calendar, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, admin, vendedor, cliente
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filter, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getUsers();
      setUsers(response.data.usuarios || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf?.includes(searchTerm)
      );
    }

    // Filtro de perfil
    if (filter !== 'all') {
      filtered = filtered.filter(user => user.perfil?.toLowerCase() === filter);
    }

    setFilteredUsers(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPerfilIcon = (perfil) => {
    switch (perfil?.toLowerCase()) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'vendedor':
        return <Building className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getPerfilColor = (perfil) => {
    switch (perfil?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'vendedor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getPerfilName = (perfil) => {
    switch (perfil?.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'vendedor':
        return 'Vendedor';
      case 'cliente':
        return 'Cliente';
      default:
        return perfil;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    admin: users.filter(u => u.perfil?.toLowerCase() === 'admin').length,
    vendedor: users.filter(u => u.perfil?.toLowerCase() === 'vendedor').length,
    cliente: users.filter(u => u.perfil?.toLowerCase() === 'cliente').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-content">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="page-title">
                Gerenciar Usuários
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="content-max-width section-spacing container-padding">
        {/* Estatísticas */}
        <div className="grid-cards mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Usuários
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Administradores
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.admin}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-500">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Vendedores
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.vendedor}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Clientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.cliente}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filter-container">
          <div className="space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filtros de Perfil */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por Perfil</h3>
              <div className="filter-buttons">
                <button
                  onClick={() => setFilter('all')}
                  className={`filter-button ${
                    filter === 'all' ? 'filter-button-active' : 'filter-button-inactive'
                  }`}
                >
                  Todos ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('admin')}
                  className={`filter-button ${
                    filter === 'admin' ? 'filter-button-active' : 'filter-button-inactive'
                  }`}
                >
                  Administradores ({stats.admin})
                </button>
                <button
                  onClick={() => setFilter('vendedor')}
                  className={`filter-button ${
                    filter === 'vendedor' ? 'filter-button-active' : 'filter-button-inactive'
                  }`}
                >
                  Vendedores ({stats.vendedor})
                </button>
                <button
                  onClick={() => setFilter('cliente')}
                  className={`filter-button ${
                    filter === 'cliente' ? 'filter-button-active' : 'filter-button-inactive'
                  }`}
                >
                  Clientes ({stats.cliente})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="list-container">
          {filteredUsers.map((userItem) => (
            <div key={userItem.id} className="list-item">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getPerfilColor(userItem.perfil)}`}>
                    {getPerfilIcon(userItem.perfil)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userItem.nome}
                    </h3>
                    <p className="text-sm text-gray-500">{userItem.email}</p>
                  </div>
                </div>
                <span className={`status-badge ${getPerfilColor(userItem.perfil)}`}>
                  {getPerfilName(userItem.perfil)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                {userItem.cpf && (
                  <div>
                    <span className="font-medium">CPF:</span> {userItem.cpf}
                  </div>
                )}
                <div>
                  <span className="font-medium">Cadastrado em:</span> {formatDate(userItem.createdAt)}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {userItem.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <h3 className="empty-state-title">
              Nenhum usuário encontrado
            </h3>
            <p className="empty-state-description">
              Não há usuários com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList; 