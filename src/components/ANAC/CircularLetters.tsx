import React, { useState } from 'react';
import { FileText, ExternalLink, Calendar, Search, Filter, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CircularLetter {
  id: string;
  number: string;
  title: string;
  subject: string;
  publishDate: string;
  category: string;
  url: string;
  summary: string;
}

export const CircularLetters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Dados mockados de Cartas Circulares
  const [circularLetters] = useState<CircularLetter[]>([
    {
      id: '1',
      number: 'CC 2024-001',
      title: 'Procedimentos de Inspeção Visual em Estruturas de Aeronaves',
      subject: 'Manutenção',
      publishDate: '2024-01-15',
      category: 'Manutenção',
      url: 'https://www.gov.br/anac/pt-br/assuntos/legislacao/legislacao-1/cartas-circulares/cc-2024-001.pdf',
      summary: 'Estabelece novos procedimentos para inspeção visual de estruturas de aeronaves, incluindo critérios de aceitação e rejeição de componentes estruturais.'
    },
    {
      id: '2',
      number: 'CC 2024-002',
      title: 'Orientações sobre Documentação de Manutenção',
      subject: 'Documentação',
      publishDate: '2024-02-01',
      category: 'Documentação',
      url: 'https://www.gov.br/anac/pt-br/assuntos/legislacao/legislacao-1/cartas-circulares/cc-2024-002.pdf',
      summary: 'Orienta sobre a correta documentação de serviços de manutenção, incluindo preenchimento de fichas e registros obrigatórios.'
    },
    {
      id: '3',
      number: 'CC 2024-003',
      title: 'Uso de Peças PMA em Aeronaves Certificadas',
      subject: 'Peças e Componentes',
      publishDate: '2024-02-15',
      category: 'Peças e Componentes',
      url: 'https://www.gov.br/anac/pt-br/assuntos/legislacao/legislacao-1/cartas-circulares/cc-2024-003.pdf',
      summary: 'Esclarece sobre o uso de peças PMA (Parts Manufacturer Approval) em aeronaves certificadas e procedimentos de instalação.'
    },
    {
      id: '4',
      number: 'CC 2024-004',
      title: 'Qualificação de Mecânicos para Aviônicos',
      subject: 'Qualificação Profissional',
      publishDate: '2024-03-01',
      category: 'Qualificação Profissional',
      url: 'https://www.gov.br/anac/pt-br/assuntos/legislacao/legislacao-1/cartas-circulares/cc-2024-004.pdf',
      summary: 'Define requisitos adicionais para qualificação de mecânicos que trabalham com sistemas aviônicos modernos.'
    },
    {
      id: '5',
      number: 'CC 2023-015',
      title: 'Procedimentos para Modificações Menores',
      subject: 'Modificações',
      publishDate: '2023-12-15',
      category: 'Modificações',
      url: 'https://www.gov.br/anac/pt-br/assuntos/legislacao/legislacao-1/cartas-circulares/cc-2023-015.pdf',
      summary: 'Estabelece procedimentos simplificados para aprovação de modificações menores em aeronaves da aviação geral.'
    }
  ]);

  const refreshFromANAC = async () => {
    setLoading(true);
    
    // Simular consulta ao site da ANAC
    setTimeout(() => {
      alert('Consulta realizada! Em produção, isso buscaria as cartas circulares mais recentes no site da ANAC.');
      setLoading(false);
    }, 2000);
  };

  const openInANAC = () => {
    window.open('https://www.gov.br/anac/pt-br/assuntos/legislacao/legislacao-1/cartas-circulares', '_blank');
  };

  const filteredLetters = circularLetters.filter(letter => {
    const matchesSearch = letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         letter.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         letter.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || letter.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(circularLetters.map(letter => letter.category)));

  const getRecentLetters = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return circularLetters.filter(letter => 
      new Date(letter.publishDate) >= thirtyDaysAgo
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Cartas Circulares</h2>
          <p className="text-sm text-gray-600">Orientações técnicas e procedimentais da ANAC</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshFromANAC}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            Atualizar
          </button>
          <button
            onClick={openInANAC}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Site ANAC
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Cartas</p>
              <p className="text-2xl font-bold text-blue-600">{circularLetters.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Publicadas Recentemente</p>
              <p className="text-2xl font-bold text-green-600">{getRecentLetters()}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Últimos 30 dias</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <Filter className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Título, número ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Cartas Circulares */}
      <div className="space-y-4">
        {filteredLetters.map((letter) => (
          <div key={letter.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{letter.number}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {letter.category}
                  </span>
                </div>
                <h4 className="text-base font-medium text-gray-800 mb-2">{letter.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{letter.summary}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Publicada em {format(new Date(letter.publishDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  <div>
                    <span>Assunto: {letter.subject}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {new Date(letter.publishDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Nova
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open(letter.url, '_blank')}
                  className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </button>
                
                <button
                  onClick={() => window.open(letter.url, '_blank')}
                  className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                
                <button
                  onClick={openInANAC}
                  className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver no Site
                </button>
              </div>

              <p className="text-sm text-gray-500">
                {letter.number}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredLetters.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma carta circular encontrada</h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar os filtros ou consulte diretamente no site da ANAC.
          </p>
          <button
            onClick={openInANAC}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Consultar Site ANAC
          </button>
        </div>
      )}

      {/* Widget de Cartas Recentes */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Cartas Circulares Recentes</h3>
            <div className="space-y-2">
              {circularLetters
                .filter(letter => new Date(letter.publishDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                .slice(0, 3)
                .map(letter => (
                  <div key={letter.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">{letter.number}</p>
                      <p className="text-xs text-blue-700">{letter.title}</p>
                    </div>
                    <button
                      onClick={() => window.open(letter.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};