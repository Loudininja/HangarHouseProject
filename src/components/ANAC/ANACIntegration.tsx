import React, { useState } from 'react';
import { Search, ExternalLink, CheckCircle, AlertTriangle, RefreshCw, Globe, FileText, Calendar } from 'lucide-react';
import { mockAircraft } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ANACData {
  registration: string;
  status: 'active' | 'inactive' | 'suspended';
  certificateNumber: string;
  certificateType: string;
  validUntil: string;
  lastUpdate: string;
  owner: string;
  operator: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
}

export const ANACIntegration: React.FC = () => {
  const [searchRegistration, setSearchRegistration] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ANACData[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');

  // Dados mockados para demonstração
  const mockANACData: ANACData[] = [
    {
      registration: 'PT-ABC',
      status: 'active',
      certificateNumber: 'CA-2024-001',
      certificateType: 'Padrão',
      validUntil: '2025-03-15',
      lastUpdate: '2024-03-01',
      owner: 'João Silva',
      operator: 'Escola de Aviação Alpha',
      model: 'Cessna 172',
      manufacturer: 'Cessna',
      serialNumber: '17280001'
    },
    {
      registration: 'PT-XYZ',
      status: 'active',
      certificateNumber: 'CA-2024-002',
      certificateType: 'Padrão',
      validUntil: '2025-08-22',
      lastUpdate: '2024-02-20',
      owner: 'Maria Santos',
      operator: 'Táxi Aéreo Beta',
      model: 'Piper Cherokee',
      manufacturer: 'Piper',
      serialNumber: '28-7405001'
    }
  ];

  const searchANAC = async () => {
    setLoading(true);
    
    // Simular chamada para API/scraping da ANAC
    setTimeout(() => {
      if (searchRegistration) {
        const results = mockANACData.filter(data => 
          data.registration.toLowerCase().includes(searchRegistration.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    }, 1500);
  };

  const syncWithANAC = async (registration: string) => {
    setLoading(true);
    
    // Simular sincronização
    setTimeout(() => {
      alert(`Dados da aeronave ${registration} sincronizados com sucesso!`);
      setLoading(false);
    }, 1000);
  };

  const bulkSync = async () => {
    setLoading(true);
    
    // Simular sincronização em massa
    setTimeout(() => {
      alert(`${mockAircraft.length} aeronaves sincronizadas com a ANAC!`);
      setLoading(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
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
      case 'suspended':
        return 'Suspensa';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      case 'suspended':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const isCertificateExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isCertificateExpired = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integração ANAC</h1>
          <p className="text-gray-600">Consulta e sincronização com dados oficiais</p>
        </div>
        <button
          onClick={bulkSync}
          disabled={loading}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar Todas
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificados Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {mockANACData.filter(d => d.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencendo</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockANACData.filter(d => isCertificateExpiringSoon(d.validUntil)).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">
                {mockANACData.filter(d => isCertificateExpired(d.validUntil)).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Última Atualização</p>
              <p className="text-2xl font-bold text-blue-600">
                {format(new Date(), "dd/MM", { locale: ptBR })}
              </p>
            </div>
            <Globe className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Busca na ANAC */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Consultar Dados na ANAC</h2>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Digite a matrícula da aeronave (ex: PT-ABC)"
              value={searchRegistration}
              onChange={(e) => setSearchRegistration(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={searchANAC}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              'Buscar'
            )}
          </button>
        </div>

        {/* Resultados da Busca */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Resultados da Consulta</h3>
            {searchResults.map((result) => (
              <div key={result.registration} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{result.registration}</h4>
                      <p className="text-sm text-gray-600">{result.model} - {result.manufacturer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusText(result.status)}
                    </span>
                    <button
                      onClick={() => syncWithANAC(result.registration)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      Sincronizar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Certificado:</span>
                    <p className="font-medium">{result.certificateNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="font-medium">{result.certificateType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Válido até:</span>
                    <p className={`font-medium ${
                      isCertificateExpired(result.validUntil) ? 'text-red-600' :
                      isCertificateExpiringSoon(result.validUntil) ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {format(new Date(result.validUntil), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Última Atualização:</span>
                    <p className="font-medium">
                      {format(new Date(result.lastUpdate), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Proprietário:</span>
                      <p className="font-medium">{result.owner}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Operador:</span>
                      <p className="font-medium">{result.operator}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Série:</span>
                      <p className="font-medium">{result.serialNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Aeronaves Cadastradas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Aeronaves Cadastradas</h2>
        
        <div className="space-y-4">
          {mockAircraft.map((aircraft) => {
            const anacData = mockANACData.find(d => d.registration === aircraft.registration);
            
            return (
              <div key={aircraft.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{aircraft.registration}</h4>
                    <p className="text-sm text-gray-600">{aircraft.model} - {aircraft.manufacturer}</p>
                    {anacData && (
                      <p className="text-xs text-gray-500">
                        Última sincronização: {format(new Date(anacData.lastUpdate), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {anacData ? (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(anacData.status)}`}>
                        {getStatusText(anacData.status)}
                      </span>
                      <button
                        onClick={() => syncWithANAC(aircraft.registration)}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => syncWithANAC(aircraft.registration)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      Sincronizar
                    </button>
                  )}
                  <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Links Úteis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Links Úteis da ANAC</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://sistemas.anac.gov.br/aeronaves"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">Consulta de Aeronaves</h4>
              <p className="text-sm text-gray-600">Sistema oficial de consulta</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </a>

          <a
            href="https://www.anac.gov.br/assuntos/legislacao/legislacao-1/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">Diretrizes de Aeronavegabilidade</h4>
              <p className="text-sm text-gray-600">ADs vigentes</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </a>

          <a
            href="https://www.anac.gov.br/assuntos/legislacao/legislacao-1/cartas-circulares"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">Cartas Circulares</h4>
              <p className="text-sm text-gray-600">Orientações técnicas</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </a>

          <a
            href="https://www.anac.gov.br/assuntos/regulados/profissionais-da-aviacao-civil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">Profissionais Habilitados</h4>
              <p className="text-sm text-gray-600">Consulta de mecânicos</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
};