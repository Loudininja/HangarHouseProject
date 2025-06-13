import React from 'react';
import { Plane, AlertTriangle, CheckCircle, Clock, TrendingUp, Settings, User, Bell, Plus } from 'lucide-react';
import { mockAircraft, mockMaintenances, mockComponents } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  onNavigate: (section: string) => void;
  onOpenAircraftForm: () => void;
  onOpenMaintenanceForm: () => void;
  onOpenCustomerForm: () => void;
  onOpenReports: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate, 
  onOpenAircraftForm, 
  onOpenMaintenanceForm, 
  onOpenCustomerForm, 
  onOpenReports 
}) => {
  const activeAircraft = mockAircraft.filter(a => a.status === 'active').length;
  const pendingMaintenances = mockMaintenances.filter(m => m.status === 'scheduled').length;
  const overdueMaintenance = mockComponents.filter(c => c.status === 'critical' || c.status === 'expired').length;
  const completedThisMonth = mockMaintenances.filter(m => 
    m.status === 'completed' && 
    new Date(m.date).getMonth() === new Date().getMonth()
  ).length;

  const stats = [
    {
      title: 'Aeronaves Ativas',
      value: activeAircraft,
      icon: Plane,
      color: 'bg-blue-500',
      trend: '+2.5%'
    },
    {
      title: 'Manutenções Pendentes',
      value: pendingMaintenances,
      icon: Clock,
      color: 'bg-yellow-500',
      trend: '-5.2%'
    },
    {
      title: 'Componentes Vencidos',
      value: overdueMaintenance,
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: '+1.1%'
    },
    {
      title: 'Concluídas este Mês',
      value: completedThisMonth,
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+12.3%'
    }
  ];

  const upcomingMaintenances = mockMaintenances
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const criticalComponents = mockComponents
    .filter(c => c.status === 'critical' || c.status === 'warning')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das operações de manutenção</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Última atualização: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                <span className="text-sm text-gray-500">vs. mês anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Manutenções</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingMaintenances.length > 0 ? (
              upcomingMaintenances.map((maintenance) => {
                const aircraft = mockAircraft.find(a => a.id === maintenance.aircraftId);
                return (
                  <div key={maintenance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">{aircraft?.registration}</p>
                      <p className="text-sm text-gray-600">{maintenance.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(maintenance.date), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      maintenance.type === 'preventive' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {maintenance.type === 'preventive' ? 'Preventiva' : 'Corretiva'}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma manutenção agendada</p>
            )}
          </div>
        </div>

        {/* Critical Components */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Componentes Críticos</h2>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="space-y-4">
            {criticalComponents.length > 0 ? (
              criticalComponents.map((component) => {
                const aircraft = mockAircraft.find(a => a.id === component.aircraftId);
                return (
                  <div key={component.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">{component.name}</p>
                      <p className="text-sm text-gray-600">{aircraft?.registration}</p>
                      <p className="text-xs text-gray-500">
                        Próxima inspeção: {format(new Date(component.nextInspectionDate), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      component.status === 'critical' 
                        ? 'bg-red-100 text-red-800' 
                        : component.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {component.status === 'critical' ? 'Crítico' : 
                       component.status === 'warning' ? 'Atenção' : 'Bom'}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">Todos os componentes estão em ordem</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button 
            onClick={() => onNavigate('unified-registration')}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
          >
            <Plus className="h-8 w-8 text-purple-400 group-hover:text-purple-500 mb-3" />
            <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">Cadastro Inicial</span>
          </button>
          
          <button 
            onClick={onOpenAircraftForm}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
          >
            <Plane className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-3" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Nova Aeronave</span>
          </button>
          
          <button 
            onClick={onOpenMaintenanceForm}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
          >
            <Settings className="h-8 w-8 text-gray-400 group-hover:text-green-500 mb-3" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Agendar Manutenção</span>
          </button>
          
          <button 
            onClick={onOpenCustomerForm}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
          >
            <User className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mb-3" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Novo Cliente</span>
          </button>
          
          <button 
            onClick={onOpenReports}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group"
          >
            <Bell className="h-8 w-8 text-gray-400 group-hover:text-orange-500 mb-3" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Gerar Relatório</span>
          </button>
        </div>
      </div>
    </div>
  );
};