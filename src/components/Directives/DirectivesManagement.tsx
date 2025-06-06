import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, AlertTriangle, Calendar, Download, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { mockDirectives, mockAircraft } from '../../data/mockData';
import { Directive } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DirectivesManagement: React.FC = () => {
  const [directives, setDirectives] = useState<Directive[]>(mockDirectives);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filteredDirectives = directives.filter(directive => {
    const matchesSearch = directive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         directive.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         directive.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || directive.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || directive.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AD':
        return 'bg-red-100 text-red-800';
      case 'SB':
        return 'bg-blue-100 text-blue-800';
      case 'circular':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'AD':
        return 'Diretriz de Aeronavegabilidade';
      case 'SB':
        return 'Service Bulletin';
      case 'circular':
        return 'Carta Circular';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'superseded':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'superseded':
        return 'Substituída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'superseded':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getComplianceStatus = (directive: Directive) => {
    if (!directive.complianceDate) return null;
    
    const today = new Date();
    const complianceDate = new Date(directive.complianceDate);
    const daysUntil = Math.ceil((complianceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { status: 'overdue', color: 'text-red-600', text: 'Vencida' };
    } else if (daysUntil <= 30) {
      return { status: 'warning', color: 'text-yellow-600', text: `${daysUntil} dias` };
    } else {
      return { status: 'ok', color: 'text-green-600', text: `${daysUntil} dias` };
    }
  };

  const getApplicableAircraftCount = (directive: Directive) => {
    return directive.applicableAircraft.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diretrizes Técnicas</h1>
          <p className="text-gray-600">Gestão de ADs, SBs e Cartas Circulares</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Diretriz
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Diretrizes</p>
              <p className="text-2xl font-bold text-indigo-600">{directives.length}</p>
            </div>
            <FileText className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ADs Ativas</p>
              <p className="text-2xl font-bold text-red-600">
                {directives.filter(d => d.type === 'AD' && d.status === 'active').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SBs Ativos</p>
              <p className="text-2xl font-bold text-blue-600">
                {directives.filter(d => d.type === 'SB' && d.status === 'active').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencendo</p>
              <p className="text-2xl font-bold text-yellow-600">
                {directives.filter(d => {
                  if (!d.complianceDate) return false;
                  const daysUntil = Math.ceil((new Date(d.complianceDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntil <= 30 && daysUntil >= 0;
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
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
              placeholder="Buscar por título, número ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos os Tipos</option>
                <option value="AD">ADs</option>
                <option value="SB">Service Bulletins</option>
                <option value="circular">Cartas Circulares</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativas</option>
              <option value="superseded">Substituídas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directives List */}
      <div className="space-y-4">
        {filteredDirectives.length > 0 ? (
          filteredDirectives.map((directive) => {
            const compliance = getComplianceStatus(directive);
            const applicableCount = getApplicableAircraftCount(directive);
            
            return (
              <div key={directive.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(directive.status)}
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{directive.number}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(directive.type)}`}>
                              {directive.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(directive.status)}`}>
                              {getStatusText(directive.status)}
                            </span>
                          </div>
                          <h4 className="text-base font-medium text-gray-800 mb-1">{directive.title}</h4>
                          <p className="text-sm text-gray-600">{directive.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Data Efetiva:</span>
                        <p className="font-medium">
                          {format(new Date(directive.effectiveDate), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      
                      {directive.complianceDate && (
                        <div>
                          <span className="text-gray-600">Cumprimento:</span>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">
                              {format(new Date(directive.complianceDate), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                            {compliance && (
                              <span className={`text-xs font-medium ${compliance.color}`}>
                                ({compliance.text})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-600">Aeronaves Aplicáveis:</span>
                        <p className="font-medium">{applicableCount} aeronave(s)</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <p className="font-medium">{getTypeText(directive.type)}</p>
                      </div>
                    </div>

                    {/* Aeronaves aplicáveis */}
                    {directive.applicableAircraft.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-gray-600 text-sm">Aeronaves aplicáveis:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {directive.applicableAircraft.map((registration) => (
                            <span
                              key={registration}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                            >
                              {registration}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                    {directive.documentUrl && (
                      <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visualizar
                      </button>
                    )}
                    <button className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
                      <Download className="h-4 w-4 mr-2" />
                      Download
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
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma diretriz encontrada</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros para encontrar as diretrizes desejadas.'
                : 'Comece cadastrando a primeira diretriz técnica no sistema.'
              }
            </p>
            {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Cadastrar Primeira Diretriz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};