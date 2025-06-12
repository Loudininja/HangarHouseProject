import React, { useState } from 'react';
import { Search, ExternalLink, AlertTriangle, Calendar, Download, CheckCircle, Clock, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Directive {
  id: string;
  number: string;
  title: string;
  description: string;
  applicableModels: string[];
  effectiveDate: string;
  complianceDate?: string;
  status: 'active' | 'superseded' | 'cancelled';
  pdfUrl: string;
  isComplied?: boolean;
  complianceNotes?: string;
  responsibleMechanic?: string;
}

export const DirectivesConsultation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Dados mockados de ADs
  const [directives, setDirectives] = useState<Directive[]>([
    {
      id: '1',
      number: 'AD 2024-001-R',
      title: 'Inspeção de Componentes de Motor Lycoming O-320',
      description: 'Inspeção obrigatória de componentes específicos do motor Lycoming O-320 devido a falhas reportadas em campo. Verificar integridade de bielas e pistões.',
      applicableModels: ['Cessna 172', 'Piper Cherokee'],
      effectiveDate: '2024-01-15',
      complianceDate: '2024-07-15',
      status: 'active',
      pdfUrl: 'https://sistemas.anac.gov.br/certificacao/DA/AD2024-001-R.pdf',
      isComplied: false
    },
    {
      id: '2',
      number: 'AD 2024-002-R',
      title: 'Modificação do Sistema de Combustível Cessna',
      description: 'Modificação obrigatória do sistema de combustível em aeronaves Cessna 172 fabricadas entre 2015-2020.',
      applicableModels: ['Cessna 172'],
      effectiveDate: '2024-02-01',
      complianceDate: '2024-08-01',
      status: 'active',
      pdfUrl: 'https://sistemas.anac.gov.br/certificacao/DA/AD2024-002-R.pdf',
      isComplied: true,
      complianceNotes: 'Modificação realizada em 15/03/2024',
      responsibleMechanic: 'Carlos Silva - CANAC 12345'
    },
    {
      id: '3',
      number: 'AD 2023-045-R',
      title: 'Verificação de Componentes Piper Cherokee',
      description: 'Diretriz para verificação de componentes específicos em aeronaves Piper Cherokee modelo PA-28.',
      applicableModels: ['Piper Cherokee'],
      effectiveDate: '2023-12-01',
      complianceDate: '2024-06-01',
      status: 'active',
      pdfUrl: 'https://sistemas.anac.gov.br/certificacao/DA/AD2023-045-R.pdf',
      isComplied: false
    }
  ]);

  const searchDirectives = async () => {
    setLoading(true);
    
    // Simular consulta ao sistema da ANAC
    setTimeout(() => {
      // Em uma implementação real, aqui seria feita a consulta ao sistema da ANAC
      // usando web scraping ou API
      setLoading(false);
      alert('Consulta realizada! Em produção, isso buscaria diretamente no sistema da ANAC.');
    }, 1500);
  };

  const markAsComplied = (directiveId: string, notes: string, mechanic: string) => {
    setDirectives(prev => prev.map(d => 
      d.id === directiveId 
        ? { 
            ...d, 
            isComplied: true, 
            complianceNotes: notes,
            responsibleMechanic: mechanic
          }
        : d
    ));
  };

  const openDirectiveInANAC = (directiveNumber: string) => {
    // Abrir diretamente no sistema da ANAC com busca preenchida
    const anacUrl = `https://sistemas.anac.gov.br/certificacao/DA/DA.asp?busca=${encodeURIComponent(directiveNumber)}`;
    window.open(anacUrl, '_blank');
  };

  const filteredDirectives = directives.filter(directive => {
    const matchesSearch = directive.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         directive.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = !selectedModel || directive.applicableModels.includes(selectedModel);
    const matchesStatus = statusFilter === 'all' || directive.status === statusFilter;
    
    return matchesSearch && matchesModel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'superseded': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'superseded': return 'Substituída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getComplianceStatus = (directive: Directive) => {
    if (directive.isComplied) {
      return { color: 'text-green-600', icon: CheckCircle, text: 'Cumprida' };
    }
    
    if (!directive.complianceDate) {
      return { color: 'text-gray-600', icon: Clock, text: 'Sem prazo' };
    }
    
    const today = new Date();
    const complianceDate = new Date(directive.complianceDate);
    const daysUntil = Math.ceil((complianceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { color: 'text-red-600', icon: AlertTriangle, text: 'Vencida' };
    } else if (daysUntil <= 30) {
      return { color: 'text-yellow-600', icon: Clock, text: `${daysUntil} dias` };
    } else {
      return { color: 'text-blue-600', icon: Calendar, text: `${daysUntil} dias` };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Diretrizes de Aeronavegabilidade (ADs)</h2>
          <p className="text-sm text-gray-600">Consulta e controle de cumprimento de ADs da ANAC</p>
        </div>
        <button
          onClick={searchDirectives}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
        >
          <Search className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Consultar ANAC
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar AD
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Número ou título da AD"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo da Aeronave
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Todos os modelos</option>
              <option value="Cessna 172">Cessna 172</option>
              <option value="Piper Cherokee">Piper Cherokee</option>
              <option value="Embraer EMB-110">Embraer EMB-110</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Ativas</option>
              <option value="superseded">Substituídas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedModel('');
                setStatusFilter('all');
              }}
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de ADs */}
      <div className="space-y-4">
        {filteredDirectives.map((directive) => {
          const compliance = getComplianceStatus(directive);
          const ComplianceIcon = compliance.icon;
          
          return (
            <div key={directive.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{directive.number}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(directive.status)}`}>
                      {getStatusText(directive.status)}
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-gray-800 mb-2">{directive.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{directive.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {directive.applicableModels.map((model, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className={`flex items-center space-x-1 ${compliance.color}`}>
                    <ComplianceIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{compliance.text}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Data Efetiva:</span>
                  <p className="font-medium">
                    {format(new Date(directive.effectiveDate), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                
                {directive.complianceDate && (
                  <div>
                    <span className="text-gray-600">Prazo de Cumprimento:</span>
                    <p className={`font-medium ${
                      new Date(directive.complianceDate) < new Date() ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {format(new Date(directive.complianceDate), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium">{getStatusText(directive.status)}</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Cumprimento:</span>
                  <p className={`font-medium ${compliance.color}`}>
                    {directive.isComplied ? 'Cumprida' : 'Pendente'}
                  </p>
                </div>
              </div>

              {directive.isComplied && directive.complianceNotes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800 font-medium">AD Cumprida</p>
                      <p className="text-sm text-green-700">{directive.complianceNotes}</p>
                      {directive.responsibleMechanic && (
                        <p className="text-xs text-green-600 mt-1">
                          Responsável: {directive.responsibleMechanic}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.open(directive.pdfUrl, '_blank')}
                    className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </button>
                  
                  <button
                    onClick={() => openDirectiveInANAC(directive.number)}
                    className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver na ANAC
                  </button>
                </div>

                {!directive.isComplied && (
                  <button
                    onClick={() => {
                      const notes = prompt('Observações sobre o cumprimento:');
                      const mechanic = prompt('Mecânico responsável:');
                      if (notes && mechanic) {
                        markAsComplied(directive.id, notes, mechanic);
                      }
                    }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Cumprida
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDirectives.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma AD encontrada</h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar os filtros ou consulte diretamente no sistema da ANAC.
          </p>
          <button
            onClick={() => window.open('https://sistemas.anac.gov.br/certificacao/DA/DA.asp', '_blank')}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Consultar ANAC
          </button>
        </div>
      )}
    </div>
  );
};