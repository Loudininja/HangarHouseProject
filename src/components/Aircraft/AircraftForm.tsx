import React, { useState } from 'react';
import { ArrowLeft, Save, X, Plane } from 'lucide-react';
import { Aircraft } from '../../types';

interface AircraftFormProps {
  aircraft?: Aircraft;
  onSave: (aircraft: Aircraft | Omit<Aircraft, 'id'>) => void;
  onCancel: () => void;
}

export const AircraftForm: React.FC<AircraftFormProps> = ({ aircraft, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    registration: aircraft?.registration || '',
    model: aircraft?.model || '',
    manufacturer: aircraft?.manufacturer || '',
    serialNumber: aircraft?.serialNumber || '',
    owner: aircraft?.owner || '',
    operator: aircraft?.operator || '',
    acquisitionDate: aircraft?.acquisitionDate || '',
    status: aircraft?.status || 'active' as const,
    totalFlightHours: aircraft?.totalFlightHours || 0,
    lastMaintenance: aircraft?.lastMaintenance || '',
    nextMaintenance: aircraft?.nextMaintenance || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.registration.trim()) newErrors.registration = 'Matrícula é obrigatória';
    if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Fabricante é obrigatório';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Número de série é obrigatório';
    if (!formData.owner.trim()) newErrors.owner = 'Proprietário é obrigatório';
    if (!formData.operator.trim()) newErrors.operator = 'Operador é obrigatório';
    if (!formData.acquisitionDate) newErrors.acquisitionDate = 'Data de aquisição é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const aircraftData = {
      ...formData,
      components: aircraft?.components || [],
    };

    if (aircraft) {
      onSave({ ...aircraftData, id: aircraft.id });
    } else {
      onSave(aircraftData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalFlightHours' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
              {aircraft ? 'Editar Aeronave' : 'Nova Aeronave'}
            </h1>
            <p className="text-gray-600">Preencha os dados da aeronave</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula *
            </label>
            <input
              type="text"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              placeholder="PT-ABC"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.registration ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.registration && (
              <p className="mt-1 text-sm text-red-600">{errors.registration}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Cessna 172"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.model ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fabricante *
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Cessna"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.manufacturer ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.manufacturer && (
              <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Série *
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="17280001"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.serialNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.serialNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
            )}
          </div>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proprietário *
            </label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="João Silva"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.owner ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.owner && (
              <p className="mt-1 text-sm text-red-600">{errors.owner}</p>
            )}
          </div>

          {/* Operator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operador *
            </label>
            <input
              type="text"
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              placeholder="Escola de Aviação Alpha"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.operator ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.operator && (
              <p className="mt-1 text-sm text-red-600">{errors.operator}</p>
            )}
          </div>

          {/* Acquisition Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Aquisição *
            </label>
            <input
              type="date"
              name="acquisitionDate"
              value={formData.acquisitionDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.acquisitionDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.acquisitionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
              <option value="sold">Vendida</option>
            </select>
          </div>

          {/* Total Flight Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horas de Voo Totais
            </label>
            <input
              type="number"
              name="totalFlightHours"
              value={formData.totalFlightHours}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Last Maintenance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Última Manutenção
            </label>
            <input
              type="date"
              name="lastMaintenance"
              value={formData.lastMaintenance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Next Maintenance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Próxima Manutenção
            </label>
            <input
              type="date"
              name="nextMaintenance"
              value={formData.nextMaintenance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-6 mt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="h-5 w-5 mr-2" />
            {aircraft ? 'Atualizar' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            <X className="h-5 w-5 mr-2" />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};