import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Eye, Trash2, Plane, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { mockAircraft, mockComponents } from '../../data/mockData';
import { Aircraft } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AircraftForm } from './AircraftForm';
import { AircraftDetails } from './AircraftDetails';

export const AircraftManagement: React.FC = () => {
  const [aircraft, setAircraft] = useState<Aircraft[]>(mockAircraft);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);

  const filteredAircraft = aircraft.filter(plane => {
    const matchesSearch = plane.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plane.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plane.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plane.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'inactive':
        return 'Inativa';
      case 'sold':
        return 'Vendida';
      default:
        return status;
    }
  };

  const getMaintenanceStatus = (aircraft: Aircraft) => {
    if (!aircraft.nextMaintenance) return null;
    
    const nextMaintenanceDate = new Date(aircraft.nextMaintenance);
    const today = new Date();
    const daysUntilMaintenance = Math.ceil((nextMaintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilMaintenance < 0) {
      return { status: 'overdue', color: 'text-red-600', icon: AlertCircle };
    } else if (daysUntilMaintenance <= 30) {
      return { status: 'warning', color: 'text-yellow-600', icon: Calendar };
    } else {
      return { status: 'good', color: 'text-green-600', icon: CheckCircle };
    }
  };

  const handleAddAircraft = (newAircraft: Omit<Aircraft, 'id'>) => {
    const aircraft: Aircraft = {
      ...newAircraft,
      id: Date.now().toString(),
    };
    setAircraft(prev => [...prev, aircraft]);
    setShowForm(false);
  };

  const handleEditAircraft = (updatedAircraft: Aircraft) => {
    setAircraft(prev => prev.map(plane => 
      plane.id === updatedAircraft.id ? updatedAircraft : plane
    ));
    setEditingAircraft(null);
  };

  const handleDeleteAircraft = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta aeronave?')) {
      setAircraft(prev => prev.filter(plane => plane.id !== id));
    }
  };

  if (showForm) {
    return (
      <AircraftForm
        onSave={handleAddAircraft}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (editingAircraft) {
    return (
      <AircraftForm
        aircraft={editingAircraft}
        onSave={handleEditAircraft}
        onCancel={() => setEditingAircraft(null)}
      />
    );
  }

  if (selectedAircraft) {
    return (
      <AircraftDetails
        aircraft={selectedAircraft}
        onBack={() => setSelectedAircraft(null)}
        onEdit={() => {
          setEditingAircraft(selectedAircraft);
          setSelectedAircraft(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Aeronaves</h1>
          <p className="text-gray-600">Cadastro e controle de aeronaves da oficina</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Aeronave
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por matrícula, modelo ou proprietário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as situações</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
              <option value="sold">Vendidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAircraft.map((plane) => {
          const maintenanceStatus = getMaintenanceStatus(plane);
          const MaintenanceIcon = maintenanceStatus?.icon;
          
          return (
            <div key={plane.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Plane className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plane.registration}</h3>
                      <p className="text-sm text-gray-600">{plane.model}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plane.status)}`}>
                    {getStatusText(plane.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fabricante:</span>
                    <span className="font-medium">{plane.manufacturer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Proprietário:</span>
                    <span className="font-medium">{plane.owner}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Horas de Voo:</span>
                    <span className="font-medium">{plane.totalFlightHours.toLocaleString()}h</span>
                  </div>
                  
                  {plane.nextMaintenance && maintenanceStatus && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-gray-600">Próxima Revisão:</span>
                      <div className="flex items-center space-x-1">
                        {MaintenanceIcon && <MaintenanceIcon className={`h-4 w-4 ${maintenanceStatus.color}`} />}
                        <span className={`font-medium ${maintenanceStatus.color}`}>
                          {format(new Date(plane.nextMaintenance), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedAircraft(plane)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </button>
                  <button
                    onClick={() => setEditingAircraft(plane)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteAircraft(plane.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAircraft.length === 0 && (
        <div className="text-center py-12">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aeronave encontrada</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Tente ajustar os filtros para encontrar as aeronaves desejadas.'
              : 'Comece cadastrando sua primeira aeronave no sistema.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Aeronave
            </button>
          )}
        </div>
      )}
    </div>
  );
};