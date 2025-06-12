import React, { useState } from 'react';
import { Search, User, CheckCircle, AlertTriangle, ExternalLink, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Professional {
  cht: string;
  name: string;
  cpf: string;
  licenseStatus: 'active' | 'suspended' | 'expired';
  licenseType: string;
  validUntil: string;
  qualifications: string[];
  company?: string;
  phone?: string;
  email?: string;
  lastUpdate: string;
}

export const ProfessionalsConsultation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'cht' | 'cpf' | 'name'>('cht');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados para demonstração
  const mockProfessionals: Professional[] = [
    {
      cht: '12345',
      name: 'Carlos Silva',
      cpf: '123.456.789-00',
      licenseStatus: 'active',
      licenseType: 'Mecânico de Manutenção Aeronáutica',
      validUntil: '2025-12-31',
      qualifications: ['Célula', 'Grupo Motopropulsor', 'Aviônicos'],
      company: 'Oficina Alpha Manutenção',
      phone: '(11) 99999-0001',
      email: 'carlos.silva@alpha.com.br',
      lastUpdate: '2024-01-15'
    },
    {
      cht: '67890',
      name: 'Ana Santos',
      cpf: '987.654.321-00',
      licenseStatus: 'active',
      licenseType: 'Mecânico de Manutenção Aeronáutica',
      validUntil: '2025-06-30',
      qualifications: ['Célula', 'Aviônicos'],
      company: 'Manutenção Beta Ltda',
      phone: '(11) 99999-0002',
      email: 'ana.santos@beta.com.br',
      lastUpdate: '2024-02-20'
    },
    {
      cht: '54321',
      name: 'Roberto Lima',
      cpf: '456.789.123-00',
      licenseStatus: 'suspended',
      licenseType: 'Mecânico de Manutenção Aeronáutica',
      validUntil: '2024-03-15',
      qualifications: ['Grupo Motopropulsor'],
      lastUpdate: '2024-03-01'
    }
  ];

  const searchProfessionals = async () => {
    if (!searchTerm.trim()) {
      setError('Digite um termo de busca válido');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);

    // Simular consulta ao sistema da ANAC
    setTimeout(() => {
      const results = mockProfessionals.filter(professional => {
        switch (searchType) {
          case 'cht':
            return professional.cht.includes(searchTerm);
          case 'cpf':
            return professional.cpf.includes(searchTerm);
          case 'name':
            return professional.name.toLowerCase().includes(searchTerm.toLowerCase());
          default:
            return false;
        }
      });

      if (results.length > 0) {
        setSearchResults(results);
      } else {
        setError('Nenhum profissional encontrado com os critérios informados');
      }

      setLoading(false);
    }, 1500);
  };

  const openInANAC = () => {
    window.open('https://sistemas.anac.gov.br/sara/externo/consultarprofissional.asp', '_blank');
  };

  const associateToMaintenance = (professional: Professional) => {
    alert(`Profissional ${professional.name} (CHT: ${professional.cht}) associado à manutenção!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'suspended': return 'Suspensa';
      case 'expired': return 'Vencida';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'suspended': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'expired': return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const isLicenseExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isLicenseExpired = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Profissionais Habilitados</h2>
          <p className="text-sm text-gray-600">Consulte mecânicos habilitados pela ANAC</p>
        </div>
        <button
          onClick={openInANAC}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Abrir ANAC
        </button>
      </div>

      {/* Formulário de Busca */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Busca
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'cht' | 'cpf' | 'name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cht">CHT (Certificado)</option>
              <option value="cpf">CPF</option>
              <option value="name">Nome</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {searchType === 'cht' && 'Número do CHT'}
              {searchType === 'cpf' && 'CPF'}
              {searchType === 'name' && 'Nome do Profissional'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={
                  searchType === 'cht' ? 'Ex: 12345' :
                  searchType === 'cpf' ? 'Ex: 123.456.789-00' :
                  'Ex: João Silva'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchProfessionals()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={searchProfessionals}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Consultando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Resultados da Busca */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Resultados da Consulta ({searchResults.length})
          </h3>
          
          {searchResults.map((professional) => (
            <div key={professional.cht} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(professional.licenseStatus)}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{professional.name}</h4>
                    <p className="text-sm text-gray-600">CHT: {professional.cht}</p>
                    <p className="text-sm text-gray-600">CPF: {professional.cpf}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(professional.licenseStatus)}`}>
                    {getStatusText(professional.licenseStatus)}
                  </span>
                  
                  {professional.licenseStatus === 'active' && (
                    <button
                      onClick={() => associateToMaintenance(professional)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Associar à Manutenção
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Informações da Licença */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 border-b border-gray-200 pb-1">
                    Licença
                  </h5>
                  <div>
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <p className="font-medium">{professional.licenseType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(professional.licenseStatus)}
                      <span className="font-medium">{getStatusText(professional.licenseStatus)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Válida até:</span>
                    <p className={`font-medium ${
                      isLicenseExpired(professional.validUntil) ? 'text-red-600' :
                      isLicenseExpiringSoon(professional.validUntil) ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {format(new Date(professional.validUntil), "dd/MM/yyyy", { locale: ptBR })}
                      {isLicenseExpired(professional.validUntil) && ' (VENCIDA)'}
                      {isLicenseExpiringSoon(professional.validUntil) && ' (VENCENDO)'}
                    </p>
                  </div>
                </div>

                {/* Habilitações */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 border-b border-gray-200 pb-1">
                    Habilitações
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {professional.qualifications.map((qualification, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {qualification}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contato */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 border-b border-gray-200 pb-1">
                    Contato
                  </h5>
                  {professional.company && (
                    <div>
                      <span className="text-sm text-gray-600">Empresa:</span>
                      <p className="font-medium">{professional.company}</p>
                    </div>
                  )}
                  {professional.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{professional.phone}</span>
                    </div>
                  )}
                  {professional.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{professional.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alertas */}
              {(isLicenseExpired(professional.validUntil) || isLicenseExpiringSoon(professional.validUntil) || professional.licenseStatus !== 'active') && (
                <div className={`mt-4 p-3 rounded-lg border ${
                  professional.licenseStatus !== 'active' || isLicenseExpired(professional.validUntil)
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      professional.licenseStatus !== 'active' || isLicenseExpired(professional.validUntil)
                        ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <p className={`text-sm font-medium ${
                      professional.licenseStatus !== 'active' || isLicenseExpired(professional.validUntil)
                        ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      {professional.licenseStatus === 'suspended' && 'Licença suspensa - Profissional não pode exercer atividades'}
                      {professional.licenseStatus === 'expired' && 'Licença vencida - Profissional não pode exercer atividades'}
                      {professional.licenseStatus === 'active' && isLicenseExpired(professional.validUntil) && 'Licença vencida'}
                      {professional.licenseStatus === 'active' && isLicenseExpiringSoon(professional.validUntil) && 'Licença próxima ao vencimento'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Última atualização: {format(new Date(professional.lastUpdate), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                
                <button
                  onClick={openInANAC}
                  className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver na ANAC
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <User className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Como usar a consulta</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Busque por CHT (número do certificado), CPF ou nome do profissional</li>
              <li>• Verifique sempre o status da licença antes de associar a uma manutenção</li>
              <li>• Profissionais com licença suspensa ou vencida não podem exercer atividades</li>
              <li>• Use "Associar à Manutenção" para vincular o mecânico a um serviço</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};