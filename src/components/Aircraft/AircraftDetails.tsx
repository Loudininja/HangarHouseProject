import React, { useState } from 'react';
import { ArrowLeft, Edit, Settings, FileText, AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Aircraft } from '../../types';
import { mockComponents, mockMaintenances } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AircraftDetailsProps {
  aircraft: Aircraft;
  onBack: () => void;
  onEdit: () => void;
}

export const AircraftDetails: React.FC<AircraftDetailsProps> = ({ aircraft, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const aircraftComponents = mockComponents.filter(c => c.aircraftId === aircraft.id);
  const aircraftMaintenances = mockMaintenances.filter(m => m.aircraftId === aircraft.id);

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

  const getComponentStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getComponentStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Bom';
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítico';
      case 'expired':
        return 'Vencido';
      default:
        return status;
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
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

  const getMaintenanceStatusText = (status: string) => {
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

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FileText },
    { id: 'components', label: 'Componentes', icon: Settings },
    { id: 'maintenance', label: 'Manutenções', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{aircraft.registration}</h1>
            <p className="text-gray-600">{aircraft.model} - {aircraft.manufacturer}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Edit className="h-5 w-5 mr-2" />
          Editar
        </button>
      </div>

      {/* Aircraft Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{aircraft.registration}</h2>
              <p className="text-gray-600">{aircraft.model}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(aircraft.status)}`}>
            {getStatusText(aircraft.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{aircraft.totalFlightHours.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Horas de Voo</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{aircraftComponents.length}</p>
            <p className="text-sm text-gray-600">Componentes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{aircraftMaintenances.length}</p>
            <p className="text-sm text-gray-600">Manutenções</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {aircraft.nextMaintenance ? format(new Date(aircraft.nextMaintenance), "dd/MM", { locale: ptBR }) : '-'}
            </p>
            <p className="text-sm text-gray-600">Próxima Revisão</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Série:</span>
                    <span className="font-medium">{aircraft.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proprietário:</span>
                    <span className="font-medium">{aircraft.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operador:</span>
                    <span className="font-medium">{aircraft.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de Aquisição:</span>
                    <span className="font-medium">
                      {format(new Date(aircraft.acquisitionDate), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Manutenção</h3>
                <div className="space-y-3">
                  {aircraft.lastMaintenance && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última Manutenção:</span>
                      <span className="font-medium">
                        {format(new Date(aircraft.lastMaintenance), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  {aircraft.nextMaintenance && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Próxima Manutenção:</span>
                      <span className="font-medium">
                        {format(new Date(aircraft.nextMaintenance), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Horas:</span>
                    <span className="font-medium">{aircraft.totalFlightHours.toLocaleString()}h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Componentes da Aeronave</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Adicionar Componente
                </button>
              </div>
              
              {aircraftComponents.length > 0 ? (
                <div className="space-y-4">
                  {aircraftComponents.map((component) => (
                    <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getComponentStatusIcon(component.status)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{component.name}</h4>
                            <p className="text-sm text-gray-600">{component.partNumber}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          component.status === 'good' ? 'bg-green-100 text-green-800' :
                          component.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getComponentStatusText(component.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Instalação:</span>
                          <p className="font-medium">
                            {format(new Date(component.installationDate), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Próxima Inspeção:</span>
                          <p className="font-medium">
                            {format(new Date(component.nextInspectionDate), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Horas Máximas:</span>
                          <p className="font-medium">{component.maxFlightHours.toLocaleString()}h</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Série:</span>
                          <p className="font-medium">{component.serialNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum componente cadastrado</h4>
                  <p className="text-gray-600">Adicione componentes para monitorar sua manutenção</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Manutenções</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  Agendar Manutenção
                </button>
              </div>
              
              {aircraftMaintenances.length > 0 ? (
                <div className="space-y-4">
                  {aircraftMaintenances.map((maintenance) => (
                    <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{maintenance.description}</h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(maintenance.date), "dd/MM/yyyy", { locale: ptBR })} - {maintenance.flightHours}h
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMaintenanceStatusColor(maintenance.status)}`}>
                          {getMaintenanceStatusText(maintenance.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Tipo:</span>
                          <p className="font-medium">
                            {maintenance.type === 'preventive' ? 'Preventiva' : 'Corretiva'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Custo:</span>
                          <p className="font-medium">R$ {maintenance.cost.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Peças Trocadas:</span>
                          <p className="font-medium">{maintenance.partsReplaced.length}</p>
                        </div>
                      </div>
                      
                      {maintenance.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-gray-600 text-sm">Observações:</span>
                          <p className="text-sm mt-1">{maintenance.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma manutenção registrada</h4>
                  <p className="text-gray-600">O histórico de manutenções aparecerá aqui</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};