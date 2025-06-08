import React, { useState } from 'react';
import { ArrowLeft, Save, X, Plane, Upload, Calendar, Clock, AlertTriangle } from 'lucide-react';
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
    // Novos campos
    yearOfManufacture: aircraft?.yearOfManufacture || '',
    maxTakeoffWeight: aircraft?.maxTakeoffWeight || 0,
    engineType: aircraft?.engineType || '',
    enginePower: aircraft?.enginePower || 0,
    fuelCapacity: aircraft?.fuelCapacity || 0,
    maxPassengers: aircraft?.maxPassengers || 0,
    certificateType: aircraft?.certificateType || 'standard',
    insuranceExpiry: aircraft?.insuranceExpiry || '',
    registrationExpiry: aircraft?.registrationExpiry || '',
    notes: aircraft?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Informações Básicas', icon: Plane },
    { id: 2, title: 'Especificações Técnicas', icon: Clock },
    { id: 3, title: 'Documentação', icon: Calendar },
    { id: 4, title: 'Observações', icon: AlertTriangle }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.registration.trim()) newErrors.registration = 'Matrícula é obrigatória';
      if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
      if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Fabricante é obrigatório';
      if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Número de série é obrigatório';
    }
    
    if (step === 2) {
      if (!formData.owner.trim()) newErrors.owner = 'Proprietário é obrigatório';
      if (!formData.operator.trim()) newErrors.operator = 'Operador é obrigatório';
      if (!formData.acquisitionDate) newErrors.acquisitionDate = 'Data de aquisição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os passos
    let allValid = true;
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!allValid) return;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['totalFlightHours', 'maxTakeoffWeight', 'enginePower', 'fuelCapacity', 'maxPassengers'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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

              {/* Year of Manufacture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano de Fabricação
                </label>
                <input
                  type="text"
                  name="yearOfManufacture"
                  value={formData.yearOfManufacture}
                  onChange={handleChange}
                  placeholder="2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Max Takeoff Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Máximo de Decolagem (kg)
                </label>
                <input
                  type="number"
                  name="maxTakeoffWeight"
                  value={formData.maxTakeoffWeight}
                  onChange={handleChange}
                  placeholder="1000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Engine Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Motor
                </label>
                <input
                  type="text"
                  name="engineType"
                  value={formData.engineType}
                  onChange={handleChange}
                  placeholder="Lycoming O-320"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Engine Power */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potência do Motor (HP)
                </label>
                <input
                  type="number"
                  name="enginePower"
                  value={formData.enginePower}
                  onChange={handleChange}
                  placeholder="160"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Fuel Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade de Combustível (L)
                </label>
                <input
                  type="number"
                  name="fuelCapacity"
                  value={formData.fuelCapacity}
                  onChange={handleChange}
                  placeholder="200"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Max Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Passageiros
                </label>
                <input
                  type="number"
                  name="maxPassengers"
                  value={formData.maxPassengers}
                  onChange={handleChange}
                  placeholder="4"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Certificado
                </label>
                <select
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="standard">Padrão</option>
                  <option value="restricted">Restrito</option>
                  <option value="experimental">Experimental</option>
                  <option value="special">Especial</option>
                </select>
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

              {/* Insurance Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimento do Seguro
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Registration Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimento do Registro
                </label>
                <input
                  type="date"
                  name="registrationExpiry"
                  value={formData.registrationExpiry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload de Documentos</h3>
                <p className="text-gray-600 mb-4">
                  Faça upload dos documentos da aeronave (Certificado de Registro, Seguro, etc.)
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Selecionar Arquivos
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações Gerais
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={6}
                placeholder="Adicione observações importantes sobre a aeronave, histórico de modificações, peculiaridades, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo do Cadastro</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Matrícula:</span>
                  <p className="font-medium">{formData.registration || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Modelo:</span>
                  <p className="font-medium">{formData.model || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fabricante:</span>
                  <p className="font-medium">{formData.manufacturer || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Proprietário:</span>
                  <p className="font-medium">{formData.owner || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Horas de Voo:</span>
                  <p className="font-medium">{formData.totalFlightHours}h</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium">
                    {formData.status === 'active' ? 'Ativa' : 
                     formData.status === 'inactive' ? 'Inativa' : 'Vendida'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
            <p className="text-gray-600">
              {aircraft ? 'Atualize os dados da aeronave' : 'Cadastre uma nova aeronave no sistema'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Anterior
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Próximo
                  <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {aircraft ? 'Atualizar' : 'Cadastrar'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};