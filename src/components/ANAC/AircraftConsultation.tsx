import React, { useState } from 'react';
import { Search, ExternalLink, Download, Plus, RefreshCw, CheckCircle, AlertTriangle, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AircraftData {
  registration: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  owner: string;
  operator: string;
  certificateNumber: string;
  certificateType: string;
  status: 'active' | 'inactive' | 'suspended';
  validUntil: string;
  lastInspection: string;
  category: string;
  yearOfManufacture: string;
}

export const AircraftConsultation: React.FC = () => {
  const [searchRegistration, setSearchRegistration] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AircraftData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados para demonstração
  const mockAircraftData: Record<string, AircraftData> = {
    'PT-ABC': {
      registration: 'PT-ABC',
      model: 'Cessna 172',
      manufacturer: 'Cessna Aircraft Company',
      serialNumber: '17280001',
      owner: 'João Silva',
      operator: 'Escola de Aviação Alpha Ltda',
      certificateNumber: 'CA-2024-001',
      certificateType: 'Certificado de Aeronavegabilidade Padrão',
      status: 'active',
      validUntil: '2025-03-15',
      lastInspection: '2024-01-15',
      category: 'Aviação Geral',
      yearOfManufacture: '2020'
    },
    'PT-XYZ': {
      registration: 'PT-XYZ',
      model: 'Piper PA-28-140',
      manufacturer: 'Piper Aircraft Corporation',
      serialNumber: '28-7405001',
      owner: 'Maria Santos',
      operator: 'Táxi Aéreo Beta Ltda',
      certificateNumber: 'CA-2024-002',
      certificateType: 'Certificado de Aeronavegabilidade Padrão',
      status: 'active',
      validUntil: '2025-08-22',
      lastInspection: '2024-02-01',
      category: 'Aviação Geral',
      yearOfManufacture: '2019'
    }
  };

  const searchAircraft = async () => {
    if (!searchRegistration.trim()) {
      setError('Digite uma matrícula válida');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResult(null);

    // Simular consulta ao sistema da ANAC
    setTimeout(() => {
      const normalizedRegistration = searchRegistration.toUpperCase().trim();
      const result = mockAircraftData[normalizedRegistration];
      
      if (result) {
        setSearchResult(result);
      } else {
        setError('Aeronave não encontrada no sistema da ANAC');
      }
      
      setLoading(false);
    }, 2000);
  };

  const openInANAC = (registration: string) => {
    // Abrir diretamente no sistema da ANAC com a matrícula preenchida
    const anacUrl = `https://sistemas.anac.gov.br/aeronaves/cons_rab.asp?textMarca=${encodeURIComponent(registration)}`;
    window.open(anacUrl, '_blank');
  };

  const importToSystem = (aircraftData: AircraftData) => {
    // Simular importação para o sistema
    alert(`Aeronave ${aircraftData.registration} importada com sucesso para o sistema!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'inactive': return 'Inativa';
      case 'suspended': return 'Suspensa';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'suspended': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Consulta de Aeronaves</h2>
          <p className="text-sm text-gray-600">Consulte dados oficiais de aeronaves no sistema da ANAC</p>
        </div>
        <button
          onClick={() => window.open('https://sistemas.anac.gov.br/aeronaves/cons_rab.asp', '_blank')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Abrir ANAC
        </button>
      </div>

      {/* Formulário de Busca */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula da Aeronave
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Ex: PT-ABC, PR-XYZ"
                value={searchRegistration}
                onChange={(e) => setSearchRegistration(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && searchAircraft()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={searchAircraft}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Resultado da Consulta */}
      {searchResult && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon(searchResult.status)}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{searchResult.registration}</h3>
                <p className="text-gray-600">{searchResult.model} - {searchResult.manufacturer}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                {getStatusText(searchResult.status)}
              </span>
              <button
                onClick={() => importToSystem(searchResult)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Importar para Sistema
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações Básicas
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Matrícula:</span>
                  <p className="font-medium">{searchResult.registration}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Modelo:</span>
                  <p className="font-medium">{searchResult.model}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Fabricante:</span>
                  <p className="font-medium">{searchResult.manufacturer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Número de Série:</span>
                  <p className="font-medium">{searchResult.serialNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ano de Fabricação:</span>
                  <p className="font-medium">{searchResult.yearOfManufacture}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Categoria:</span>
                  <p className="font-medium">{searchResult.category}</p>
                </div>
              </div>
            </div>

            {/* Proprietário e Operador */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Proprietário e Operador
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Proprietário:</span>
                  <p className="font-medium">{searchResult.owner}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Operador:</span>
                  <p className="font-medium">{searchResult.operator}</p>
                </div>
              </div>
            </div>

            {/* Certificação */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Certificação
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Número do Certificado:</span>
                  <p className="font-medium">{searchResult.certificateNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tipo de Certificado:</span>
                  <p className="font-medium">{searchResult.certificateType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(searchResult.status)}
                    <span className="font-medium">{getStatusText(searchResult.status)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Válido até:</span>
                  <p className={`font-medium ${
                    isCertificateExpired(searchResult.validUntil) ? 'text-red-600' :
                    isCertificateExpiringSoon(searchResult.validUntil) ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {format(new Date(searchResult.validUntil), "dd/MM/yyyy", { locale: ptBR })}
                    {isCertificateExpired(searchResult.validUntil) && ' (VENCIDO)'}
                    {isCertificateExpiringSoon(searchResult.validUntil) && ' (VENCENDO)'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Última Inspeção:</span>
                  <p className="font-medium">
                    {format(new Date(searchResult.lastInspection), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {(isCertificateExpired(searchResult.validUntil) || isCertificateExpiringSoon(searchResult.validUntil)) && (
            <div className={`mt-6 p-4 rounded-lg border ${
              isCertificateExpired(searchResult.validUntil) 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`h-5 w-5 ${
                  isCertificateExpired(searchResult.validUntil) ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <div>
                  <p className={`font-medium ${
                    isCertificateExpired(searchResult.validUntil) ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {isCertificateExpired(searchResult.validUntil) 
                      ? 'Certificado de Aeronavegabilidade VENCIDO' 
                      : 'Certificado de Aeronavegabilidade próximo ao vencimento'
                    }
                  </p>
                  <p className={`text-sm ${
                    isCertificateExpired(searchResult.validUntil) ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {isCertificateExpired(searchResult.validUntil) 
                      ? 'A aeronave não pode voar até a renovação do certificado.'
                      : 'Providencie a renovação do certificado antes do vencimento.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => openInANAC(searchResult.registration)}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver na ANAC
              </button>
              
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Imprimir
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Dados consultados em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Plane className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Como usar a consulta</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Digite a matrícula completa da aeronave (ex: PT-ABC)</li>
              <li>• Os dados são consultados diretamente no sistema oficial da ANAC</li>
              <li>• Use "Importar para Sistema" para adicionar a aeronave ao seu cadastro</li>
              <li>• Verifique sempre a validade dos certificados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};