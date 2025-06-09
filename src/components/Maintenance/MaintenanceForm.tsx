import React, { useState } from 'react';
import { ArrowLeft, Save, X, Calendar, Clock, Wrench, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Maintenance, Part } from '../../types';
import { mockAircraft, mockCustomers } from '../../data/mockData';

interface MaintenanceFormProps {
  maintenance?: Maintenance;
  onSave: (maintenance: Maintenance | Omit<Maintenance, 'id'>) => void;
  onCancel: () => void;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ maintenance, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    aircraftId: maintenance?.aircraftId || '',
    type: maintenance?.type || 'preventive' as const,
    description: maintenance?.description || '',
    date: maintenance?.date || '',
    flightHours: maintenance?.flightHours || 0,
    mechanicId: maintenance?.mechanicId || '',
    cost: maintenance?.cost || 0,
    status: maintenance?.status || 'scheduled' as const,
    notes: maintenance?.notes || '',
    estimatedDuration: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    workOrderNumber: '',
    customerNotified: false
  });

  const [partsReplaced, setPartsReplaced] = useState<Part[]>(maintenance?.partsReplaced || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mechanics = [
    { id: 'mech-1', name: 'Carlos Silva - CANAC 12345' },
    { id: 'mech-2', name: 'Ana Santos - CANAC 67890' },
    { id: 'mech-3', name: 'Roberto Lima - CANAC 54321' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.aircraftId) newErrors.aircraftId = 'Aeronave é obrigatória';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.mechanicId) newErrors.mechanicId = 'Mecânico responsável é obrigatório';
    if (formData.flightHours < 0) newErrors.flightHours = 'Horas de voo devem ser positivas';
    if (formData.cost < 0) newErrors.cost = 'Custo deve ser positivo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const maintenanceData = {
      ...formData,
      partsReplaced,
    };

    if (maintenance) {
      onSave({ ...maintenanceData, id: maintenance.id });
    } else {
      onSave(maintenanceData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              ['flightHours', 'cost'].includes(name) ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addPart = () => {
    const newPart: Part = {
      id: Date.now().toString(),
      name: '',
      partNumber: '',
      quantity: 1,
      cost: 0,
      supplier: ''
    };
    setPartsReplaced(prev => [...prev, newPart]);
  };

  const updatePart = (index: number, field: keyof Part, value: string | number) => {
    setPartsReplaced(prev => prev.map((part, i) => 
      i === index ? { ...part, [field]: value } : part
    ));
  };

  const removePart = (index: number) => {
    setPartsReplaced(prev => prev.filter((_, i) => i !== index));
  };

  const selectedAircraft = mockAircraft.find(a => a.id === formData.aircraftId);
  const customer = selectedAircraft ? mockCustomers.find(c => c.aircraftIds.includes(selectedAircraft.id)) : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {maintenance ? 'Editar Manutenção' : 'Agendar Manutenção'}
            </h1>
            <p className="text-gray-600">
              {maintenance ? 'Atualize os dados da manutenção' : 'Agende uma nova manutenção preventiva ou corretiva'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aeronave *
              </label>
              <select
                name="aircraftId"
                value={formData.aircraftId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.aircraftId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma aeronave</option>
                {mockAircraft.filter(a => a.status === 'active').map(aircraft => (
                  <option key={aircraft.id} value={aircraft.id}>
                    {aircraft.registration} - {aircraft.model}
                  </option>
                ))}
              </select>
              {errors.aircraftId && (
                <p className="mt-1 text-sm text-red-600">{errors.aircraftId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Manutenção *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="preventive">Preventiva</option>
                <option value="corrective">Corretiva</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Agendada *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração Estimada
              </label>
              <input
                type="text"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="Ex: 4 horas, 2 dias"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horas de Voo Atuais
              </label>
              <input
                type="number"
                name="flightHours"
                value={formData.flightHours}
                onChange={handleChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.flightHours ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.flightHours && (
                <p className="mt-1 text-sm text-red-600">{errors.flightHours}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mecânico Responsável *
              </label>
              <select
                name="mechanicId"
                value={formData.mechanicId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.mechanicId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um mecânico</option>
                {mechanics.map(mechanic => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </option>
                ))}
              </select>
              {errors.mechanicId && (
                <p className="mt-1 text-sm text-red-600">{errors.mechanicId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="scheduled">Agendada</option>
                <option value="in-progress">Em Andamento</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição dos Serviços *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descreva detalhadamente os serviços a serem realizados..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Informações do Cliente */}
          {customer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Informações do Cliente</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Nome:</span>
                  <p className="font-medium text-blue-900">{customer.name}</p>
                </div>
                <div>
                  <span className="text-blue-700">Email:</span>
                  <p className="font-medium text-blue-900">{customer.email}</p>
                </div>
                <div>
                  <span className="text-blue-700">Telefone:</span>
                  <p className="font-medium text-blue-900">{customer.phone}</p>
                </div>
                <div>
                  <span className="text-blue-700">Empresa:</span>
                  <p className="font-medium text-blue-900">{customer.company || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="customerNotified"
                    checked={formData.customerNotified}
                    onChange={handleChange}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-blue-700">Cliente foi notificado sobre o agendamento</span>
                </label>
              </div>
            </div>
          )}

          {/* Peças e Materiais */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Peças e Materiais</h3>
              <button
                type="button"
                onClick={addPart}
                className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Peça
              </button>
            </div>

            {partsReplaced.length > 0 ? (
              <div className="space-y-4">
                {partsReplaced.map((part, index) => (
                  <div key={part.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Peça #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removePart(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Peça
                        </label>
                        <input
                          type="text"
                          value={part.name}
                          onChange={(e) => updatePart(index, 'name', e.target.value)}
                          placeholder="Ex: Filtro de óleo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Part Number
                        </label>
                        <input
                          type="text"
                          value={part.partNumber}
                          onChange={(e) => updatePart(index, 'partNumber', e.target.value)}
                          placeholder="Ex: OF-001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fornecedor
                        </label>
                        <input
                          type="text"
                          value={part.supplier}
                          onChange={(e) => updatePart(index, 'supplier', e.target.value)}
                          placeholder="Ex: Lycoming"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          value={part.quantity}
                          onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custo Unitário (R$)
                        </label>
                        <input
                          type="number"
                          value={part.cost}
                          onChange={(e) => updatePart(index, 'cost', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                            R$ {(part.quantity * part.cost).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total de Peças:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {partsReplaced.reduce((total, part) => total + (part.quantity * part.cost), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Wrench className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Nenhuma peça adicionada</p>
                <p className="text-sm text-gray-400">Clique em "Adicionar Peça" para incluir materiais</p>
              </div>
            )}
          </div>

          {/* Custo Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custo Total da Manutenção (R$)
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Incluindo mão de obra e peças"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.cost ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações Adicionais
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Observações importantes, requisitos especiais, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Prioridade Visual */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Prioridade:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(formData.priority)}`}>
              {formData.priority === 'urgent' ? 'Urgente' :
               formData.priority === 'high' ? 'Alta' :
               formData.priority === 'normal' ? 'Normal' : 'Baixa'}
            </span>
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Save className="h-5 w-5 mr-2" />
              {maintenance ? 'Atualizar' : 'Agendar'} Manutenção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};