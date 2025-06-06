import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, PieChart, BarChart3, Filter, Tangent as DateRange } from 'lucide-react';
import { mockAircraft, mockMaintenances, mockComponents } from '../../data/mockData';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ReportsManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('general');

  const currentDate = new Date();
  const currentMonth = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  
  // Cálculos de métricas
  const totalAircraft = mockAircraft.length;
  const activeAircraft = mockAircraft.filter(a => a.status === 'active').length;
  const maintenancesThisMonth = mockMaintenances.filter(m => {
    const maintenanceDate = new Date(m.date);
    return maintenanceDate >= startOfMonth(currentDate) && maintenanceDate <= endOfMonth(currentDate);
  }).length;
  
  const totalMaintenanceCosts = mockMaintenances
    .filter(m => m.status === 'completed')
    .reduce((total, m) => total + m.cost, 0);

  const averageFlightHours = Math.round(
    mockAircraft.reduce((total, a) => total + a.totalFlightHours, 0) / mockAircraft.length
  );

  const criticalComponents = mockComponents.filter(c => c.status === 'critical' || c.status === 'expired').length;

  const generateGeneralReport = () => {
    const reportData = {
      period: currentMonth,
      summary: {
        totalAircraft,
        activeAircraft,
        maintenancesThisMonth,
        totalMaintenanceCosts,
        averageFlightHours,
        criticalComponents
      },
      maintenancesByType: {
        preventive: mockMaintenances.filter(m => m.type === 'preventive').length,
        corrective: mockMaintenances.filter(m => m.type === 'corrective').length
      },
      maintenancesByStatus: {
        completed: mockMaintenances.filter(m => m.status === 'completed').length,
        inProgress: mockMaintenances.filter(m => m.status === 'in-progress').length,
        scheduled: mockMaintenances.filter(m => m.status === 'scheduled').length
      }
    };
    
    console.log('Relatório Geral:', reportData);
    alert('Relatório geral gerado! Verifique o console para os dados.');
  };

  const generateMaintenanceReport = () => {
    const maintenanceReport = mockMaintenances.map(m => {
      const aircraft = mockAircraft.find(a => a.id === m.aircraftId);
      return {
        aircraft: aircraft?.registration,
        model: aircraft?.model,
        maintenance: m.description,
        type: m.type,
        date: format(new Date(m.date), 'dd/MM/yyyy', { locale: ptBR }),
        cost: m.cost,
        status: m.status,
        flightHours: m.flightHours
      };
    });
    
    console.log('Relatório de Manutenções:', maintenanceReport);
    alert('Relatório de manutenções gerado! Verifique o console para os dados.');
  };

  const generateComponentsReport = () => {
    const componentsReport = mockComponents.map(c => {
      const aircraft = mockAircraft.find(a => a.id === c.aircraftId);
      return {
        aircraft: aircraft?.registration,
        component: c.name,
        partNumber: c.partNumber,
        serialNumber: c.serialNumber,
        installationDate: format(new Date(c.installationDate), 'dd/MM/yyyy', { locale: ptBR }),
        nextInspection: format(new Date(c.nextInspectionDate), 'dd/MM/yyyy', { locale: ptBR }),
        status: c.status,
        maxFlightHours: c.maxFlightHours
      };
    });
    
    console.log('Relatório de Componentes:', componentsReport);
    alert('Relatório de componentes gerado! Verifique o console para os dados.');
  };

  const reports = [
    {
      id: 'general',
      title: 'Relatório Geral',
      description: 'Visão geral de todas as operações',
      icon: PieChart,
      action: generateGeneralReport
    },
    {
      id: 'maintenance',
      title: 'Relatório de Manutenções',
      description: 'Detalhes de todas as manutenções realizadas',
      icon: BarChart3,
      action: generateMaintenanceReport
    },
    {
      id: 'components',
      title: 'Relatório de Componentes',
      description: 'Status e cronograma de componentes',
      icon: FileText,
      action: generateComponentsReport
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h1>
          <p className="text-gray-600">Dashboards e relatórios operacionais</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Ano</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
            <Download className="h-5 w-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aeronaves</p>
              <p className="text-2xl font-bold text-blue-600">{totalAircraft}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{activeAircraft} ativas</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Manutenções</p>
              <p className="text-2xl font-bold text-green-600">{maintenancesThisMonth}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Este mês</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Custos</p>
              <p className="text-2xl font-bold text-purple-600">R$ {totalMaintenanceCosts.toLocaleString()}</p>
            </div>
            <PieChart className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Total gasto</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Horas Médias</p>
              <p className="text-2xl font-bold text-indigo-600">{averageFlightHours}h</p>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Por aeronave</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Componentes</p>
              <p className="text-2xl font-bold text-yellow-600">{criticalComponents}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Críticos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eficiência</p>
              <p className="text-2xl font-bold text-emerald-600">94%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Operacional</p>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Manutenções por Tipo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manutenções por Tipo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Preventivas</span>
              </div>
              <span className="text-sm font-medium">{mockMaintenances.filter(m => m.type === 'preventive').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">Corretivas</span>
              </div>
              <span className="text-sm font-medium">{mockMaintenances.filter(m => m.type === 'corrective').length}</span>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="mt-6">
            <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500" 
                style={{
                  width: `${(mockMaintenances.filter(m => m.type === 'preventive').length / mockMaintenances.length) * 100}%`
                }}
              ></div>
              <div 
                className="bg-orange-500"
                style={{
                  width: `${(mockMaintenances.filter(m => m.type === 'corrective').length / mockMaintenances.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status de Aeronaves */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Aeronaves</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Ativas</span>
              </div>
              <span className="text-sm font-medium">{mockAircraft.filter(a => a.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Inativas</span>
              </div>
              <span className="text-sm font-medium">{mockAircraft.filter(a => a.status === 'inactive').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm text-gray-600">Vendidas</span>
              </div>
              <span className="text-sm font-medium">{mockAircraft.filter(a => a.status === 'sold').length}</span>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="mt-6">
            <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-green-500" 
                style={{
                  width: `${(mockAircraft.filter(a => a.status === 'active').length / mockAircraft.length) * 100}%`
                }}
              ></div>
              <div 
                className="bg-yellow-500"
                style={{
                  width: `${(mockAircraft.filter(a => a.status === 'inactive').length / mockAircraft.length) * 100}%`
                }}
              ></div>
              <div 
                className="bg-gray-500"
                style={{
                  width: `${(mockAircraft.filter(a => a.status === 'sold').length / mockAircraft.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Relatórios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Gerar Relatórios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                <button
                  onClick={report.action}
                  className="w-full flex items-center justify-center px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cronograma de Manutenções */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Cronograma de Manutenções</h2>
        <div className="space-y-4">
          {mockMaintenances
            .filter(m => m.status === 'scheduled')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((maintenance) => {
              const aircraft = mockAircraft.find(a => a.id === maintenance.aircraftId);
              const daysUntil = Math.ceil((new Date(maintenance.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={maintenance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      daysUntil <= 7 ? 'bg-red-500' : daysUntil <= 30 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{aircraft?.registration}</p>
                      <p className="text-sm text-gray-600">{maintenance.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(maintenance.date), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                    <p className={`text-xs ${
                      daysUntil <= 7 ? 'text-red-600' : daysUntil <= 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {daysUntil > 0 ? `${daysUntil} dias` : 'Atrasada'}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};