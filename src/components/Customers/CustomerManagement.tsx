import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, Phone, User, Building, MapPin, Edit, Eye } from 'lucide-react';
import { mockCustomers, mockAircraft } from '../../data/mockData';
import { Customer } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CustomerForm } from './CustomerForm';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleAddCustomer = (newCustomer: Omit<Customer, 'id'>) => {
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
    };
    setCustomers(prev => [...prev, customer]);
    setShowForm(false);
  };

  const handleEditCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === updatedCustomer.id ? updatedCustomer : c
    ));
    setEditingCustomer(null);
  };

  const getCustomerAircraft = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return [];
    
    return mockAircraft.filter(aircraft => customer.aircraftIds.includes(aircraft.id));
  };

  if (showForm) {
    return (
      <CustomerForm
        onSave={handleAddCustomer}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (editingCustomer) {
    return (
      <CustomerForm
        customer={editingCustomer}
        onSave={handleEditCustomer}
        onCancel={() => setEditingCustomer(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600">Cadastro e comunicação com proprietários e operadores</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-purple-600">{customers.length}</p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empresas</p>
              <p className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.company).length}
              </p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aeronaves Ativas</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.reduce((acc, customer) => acc + customer.aircraftIds.length, 0)}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nome, empresa ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => {
          const customerAircraft = getCustomerAircraft(customer.id);
          
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    {customer.company && (
                      <p className="text-sm text-gray-600">{customer.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{customer.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{customer.phone}</span>
                </div>

                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{customer.address}</span>
                </div>

                {customer.lastContact && (
                  <div className="text-sm">
                    <span className="text-gray-600">Último contato: </span>
                    <span className="font-medium">
                      {format(new Date(customer.lastContact), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>

              {/* Aircraft List */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Aeronaves ({customerAircraft.length})
                </h4>
                {customerAircraft.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {customerAircraft.map((aircraft) => (
                      <span
                        key={aircraft.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {aircraft.registration}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma aeronave cadastrada</p>
                )}
              </div>

              <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                  <Eye className="h-4 w-4 mr-1" />
                  Perfil
                </button>
                <button 
                  onClick={() => setEditingCustomer(customer)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <Mail className="h-4 w-4 mr-1" />
                  Contatar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Tente ajustar o termo de busca para encontrar os clientes desejados.'
              : 'Comece cadastrando o primeiro cliente no sistema.'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Cliente
            </button>
          )}
        </div>
      )}
    </div>
  );
};