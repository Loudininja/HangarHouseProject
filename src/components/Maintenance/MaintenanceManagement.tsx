import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockMaintenances, mockAircraft } from '../../data/mockData';
import { Maintenance } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const MaintenanceManagement: React.FC = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>(mockMaintenances);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMaintenances = maintenances.filter(maintenance => {
    const aircraft = mockAircraft.find(a => a.id === maintenance.aircraftId);
    const matchesSearch = maintenance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft?.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft?.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || maintenance.status === statusFilter;
    const matchesType = typeFilter === 'all' || maintenance.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in-progress':
        return 'Em Andamento';
      case 'scheduled':
        return 'Agendada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'scheduled':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'preventive' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-orange-100 text-orange-800';
  };

  const getTypeText = (type: string) => {
    return type === 'preventive' ? 'Preventiva' : 'Corretiva';
  };

  const getPriorityLevel = (maintenance: Maintenance) => {
    const today = new Date();
    const maintenanceDate = new Date(maintenance.date);
    const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (maintenance.status === 'completed') return null;
    
    if (daysUntil < 0) {
      return { level: 'overdue', color: 'text-red-600', text: 'Atrasada' };
    } else if (daysUntil <= 7) {
      return { level: 'urgent', color: 'text-orange-600', text: 'Urgente' };
    } else if (daysUntil <= 30) {
      return { level: 'soon', color: 'text-yellow-600', text: 'Próxima' };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Controle de Manutenções</h1>
          <p className="text-gray-600">Agendamento e acompanhamento de revisões e reparos</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
          <Plus className="h-5 w-5 mr-2" />
          Agendar Manutenção
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendadas</p>
              <p className="text-2xl font-bold text-yellow-600">
                {maintenances.filter(m => m.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">
                {maintenances.filter(m => m.status === 'in-progress').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">
                {maintenances.filter(m => m.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Atrasadas</p>
              <p className="text-2xl font-bold text-red-600">
                {maintenances.filter(m => {
                  const today = new Date();
                  const maintenanceDate = new Date(m.date);
                  return m.status === 'scheduled' && maintenanceDate < today;
                }).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por descrição, matrícula ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="scheduled">Agendadas</option>
                <option value="in-progress">Em Andamento</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos os Tipos</option>
              <option value="preventive">Preventiva</option>
              <option value="corrective">Corretiva</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance List */}
      <div className="space-y-4">
        {filteredMaintenances.length > 0 ? (
          filteredMaintenances.map((maintenance) => {
            const aircraft = mockAircraft.find(a => a.id === maintenance.aircraftId);
            const priority = getPriorityLevel(maintenance);
            
            return (
              <div key={maintenance.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(maintenance.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{maintenance.description}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">
                              {aircraft?.registration} - {aircraft?.model}
                            </span>
                            {priority && (
                              <span className={`text-sm font-medium ${priority.color}`}>
                                {priority.text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(maintenance.type)}`}>
                          {getTypeText(maintenance.type)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                          {getStatusText(maintenance.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Data:</span>
                        <p className="font-medium">
                          {format(new Date(maintenance.date), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Horas de Voo:</span>
                        <p className="font-medium">{maintenance.flightHours.toLocaleString()}h</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Custo:</span>
                        <p className="font-medium">R$ {maintenance.cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Peças:</span>
                        <p className="font-medium">{maintenance.partsReplaced.length} item(s)</p>
                      </div>
                    </div>

                    {maintenance.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-gray-600 text-sm">Observações:</span>
                        <p className="text-sm mt-1">{maintenance.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      Visualizar
                    </button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma manutenção encontrada</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Tente ajustar os filtros para encontrar as manutenções desejadas.'
                : 'Comece agendando a primeira manutenção no sistema.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                <Plus className="h-5 w-5 mr-2" />
                Agendar Primeira Manutenção
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};