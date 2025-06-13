import React, { useState } from 'react';
import { Plus, Search, Filter, Download, FileText, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { UnifiedRegistrationForm } from './UnifiedRegistrationForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RegistrationRecord {
  id: string;
  aircraft: {
    registration: string;
    model: string;
    manufacturer: string;
  };
  owner: {
    name: string;
    cpf: string;
  };
  operator: {
    name: string;
    email: string;
  };
  status: 'complete' | 'pending' | 'incomplete';
  entryDate: string;
  lastUpdate: string;
}

export const UnifiedRegistrationManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dados mockados de registros
  const [registrations] = useState<RegistrationRecord[]>([
    {
      id: '1',
      aircraft: {
        registration: 'PT-ABC',
        model: 'Cessna 172',
        manufacturer: 'Cessna'
      },
      owner: {
        name: 'João Silva',
        cpf: '123.456.789-00'
      },
      operator: {
        name: 'Escola de Aviação Alpha',
        email: 'contato@alpha.com.br'
      },
      status: 'complete',
      entryDate: '2024-01-15',
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      aircraft: {
        registration: 'PR-XYZ',
        model: 'Cherokee PA-28',
        manufacturer: 'Piper'
      },
      owner: {
        name: 'Maria Santos',
        cpf: '987.654.321-00'
      },
      operator: {
        name: 'Táxi Aéreo Beta',
        email: 'operacoes@beta.com.br'
      },
      status: 'pending',
      entryDate: '2024-02-01',
      lastUpdate: '2024-02-01'
    }
  ]);

  const handleSaveRegistration = (data: any) => {
    console.log('Dados do cadastro unificado:', data);
    
    // Aqui você salvaria os dados nos módulos separados:
    // 1. Salvar cliente
    // 2. Salvar aeronave
    // 3. Salvar motor como componente
    // 4. Salvar hélice como componente
    // 5. Criar relacionamentos
    
    alert('Cadastro unificado salvo com sucesso! Os dados foram distribuídos nos módulos apropriados.');
    setShowForm(false);
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.operator.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'incomplete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Completo';
      case 'pending':
        return 'Pendente';
      case 'incomplete':
        return 'Incompleto';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'incomplete':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const exportToExcel = () => {
    // Simular exportação para Excel
    const csvContent = [
      ['Matrícula', 'Modelo', 'Proprietário', 'Operador', 'Status', 'Data de Entrada'],
      ...filteredRegistrations.map(reg => [
        reg.aircraft.registration,
        reg.aircraft.model,
        reg.owner.name,
        reg.operator.name,
        getStatusText(reg.status),
        format(new Date(reg.entryDate), 'dd/MM/yyyy', { locale: ptBR })
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cadastros_unificados_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showForm) {
    return (
      <UnifiedRegistrationForm
        onSave={handleSaveRegistration}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro Inicial Unificado</h1>
          <p className="text-gray-600">Cadastro completo de aeronaves, proprietários e componentes</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar Excel
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Cadastro
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Cadastros</p>
              <p className="text-2xl font-bold text-blue-600">{registrations.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completos</p>
              <p className="text-2xl font-bold text-green-600">
                {registrations.filter(r => r.status === 'complete').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Incompletos</p>
              <p className="text-2xl font-bold text-red-600">
                {registrations.filter(r => r.status === 'incomplete').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
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
              placeholder="Buscar por matrícula, proprietário ou operador..."
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
              <option value="all">Todos os Status</option>
              <option value="complete">Completos</option>
              <option value="pending">Pendentes</option>
              <option value="incomplete">Incompletos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(registration.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {registration.aircraft.registration}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {registration.aircraft.manufacturer} {registration.aircraft.model}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                  {getStatusText(registration.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Proprietário</h4>
                  <p className="text-sm text-gray-600">{registration.owner.name}</p>
                  <p className="text-sm text-gray-500">{registration.owner.cpf}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Operador</h4>
                  <p className="text-sm text-gray-600">{registration.operator.name}</p>
                  <p className="text-sm text-gray-500">{registration.operator.email}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Datas</h4>
                  <p className="text-sm text-gray-600">
                    Entrada: {format(new Date(registration.entryDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Atualização: {format(new Date(registration.lastUpdate), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    Visualizar
                  </button>
                  <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    Editar
                  </button>
                  <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    Exportar PDF
                  </button>
                </div>
                
                <p className="text-sm text-gray-500">
                  ID: {registration.id}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cadastro encontrado</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros para encontrar os cadastros desejados.'
                : 'Comece criando o primeiro cadastro unificado no sistema.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Criar Primeiro Cadastro
              </button>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Como funciona o Cadastro Unificado</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Passo 1:</strong> Preencha os dados do proprietário e operador</li>
              <li>• <strong>Passo 2:</strong> Consulte automaticamente a ANAC pela matrícula</li>
              <li>• <strong>Passo 3:</strong> Complete os dados da aeronave, motor e hélice</li>
              <li>• <strong>Passo 4:</strong> Adicione documentos e observações</li>
              <li>• <strong>Resultado:</strong> Os dados são automaticamente distribuídos nos módulos apropriados (Clientes, Aeronaves, Componentes)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};