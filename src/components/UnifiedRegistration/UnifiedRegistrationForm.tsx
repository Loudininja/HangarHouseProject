import React, { useState } from 'react';
import { ArrowLeft, Save, Search, AlertTriangle, CheckCircle, Upload, Download, FileText, User, Plane, Settings, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UnifiedRegistrationData {
  // Cliente/Proprietário
  owner: {
    name: string;
    cpf: string;
    address: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Operador
  operator: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    technicalResponsible: string;
    alternativeContact: string;
  };
  
  // Aeronave
  aircraft: {
    registration: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    yearOfManufacture: string;
    category: string;
    certificationType: string;
    cvaValidUntil: string;
    airworthinessStatus: string;
    totalHours: number;
    lastMaintenance: string;
    nextInspection: string;
  };
  
  // Motor
  engine: {
    manufacturer: string;
    model: string;
    serialNumber: string;
    tsn: number;
    tso: number;
    currentHours: number;
    lastRevision: string;
    estimatedExpiry: string;
  };
  
  // Hélice
  propeller: {
    manufacturer: string;
    model: string;
    serialNumber: string;
    tsn: number;
    tso: number;
    lastRevision: string;
    nextRevision: string;
  };
  
  // Dados complementares
  additional: {
    entryDate: string;
    generalNotes: string;
    documents: File[];
  };
}

interface UnifiedRegistrationFormProps {
  onSave: (data: UnifiedRegistrationData) => void;
  onCancel: () => void;
}

export const UnifiedRegistrationForm: React.FC<UnifiedRegistrationFormProps> = ({ onSave, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [anacData, setAnacData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<UnifiedRegistrationData>({
    owner: {
      name: '',
      cpf: '',
      address: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    },
    operator: {
      name: '',
      cpf: '',
      phone: '',
      email: '',
      technicalResponsible: '',
      alternativeContact: ''
    },
    aircraft: {
      registration: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      yearOfManufacture: '',
      category: '',
      certificationType: '',
      cvaValidUntil: '',
      airworthinessStatus: 'active',
      totalHours: 0,
      lastMaintenance: '',
      nextInspection: ''
    },
    engine: {
      manufacturer: '',
      model: '',
      serialNumber: '',
      tsn: 0,
      tso: 0,
      currentHours: 0,
      lastRevision: '',
      estimatedExpiry: ''
    },
    propeller: {
      manufacturer: '',
      model: '',
      serialNumber: '',
      tsn: 0,
      tso: 0,
      lastRevision: '',
      nextRevision: ''
    },
    additional: {
      entryDate: format(new Date(), 'yyyy-MM-dd'),
      generalNotes: '',
      documents: []
    }
  });

  const steps = [
    { id: 1, title: 'Cliente/Proprietário', icon: User, color: 'blue' },
    { id: 2, title: 'Aeronave', icon: Plane, color: 'green' },
    { id: 3, title: 'Motor', icon: Settings, color: 'orange' },
    { id: 4, title: 'Hélice', icon: Wrench, color: 'purple' },
    { id: 5, title: 'Finalização', icon: FileText, color: 'indigo' }
  ];

  // Consulta ANAC simulada
  const consultANAC = async (registration: string) => {
    if (!registration.trim()) return;
    
    setLoading(true);
    
    // Simular consulta à ANAC
    setTimeout(() => {
      const mockData = {
        'PT-ABC': {
          manufacturer: 'Cessna',
          model: 'Cessna 172',
          serialNumber: '17280001',
          yearOfManufacture: '2020',
          category: 'Aviação Geral',
          owner: 'João Silva',
          operator: 'Escola de Aviação Alpha',
          status: 'active'
        },
        'PR-ABC': {
          manufacturer: 'Piper',
          model: 'Cherokee PA-28',
          serialNumber: '28-7405001',
          yearOfManufacture: '2019',
          category: 'Aviação Geral',
          owner: 'Maria Santos',
          operator: 'Táxi Aéreo Beta',
          status: 'active'
        }
      };

      const data = mockData[registration.toUpperCase() as keyof typeof mockData];
      
      if (data) {
        setAnacData(data);
        setFormData(prev => ({
          ...prev,
          aircraft: {
            ...prev.aircraft,
            manufacturer: data.manufacturer,
            model: data.model,
            serialNumber: data.serialNumber,
            yearOfManufacture: data.yearOfManufacture,
            category: data.category
          },
          owner: {
            ...prev.owner,
            name: data.owner
          },
          operator: {
            ...prev.operator,
            name: data.operator
          }
        }));
        alert('Dados encontrados na ANAC e preenchidos automaticamente!');
      } else {
        alert('Aeronave não encontrada na base da ANAC. Preencha os dados manualmente.');
      }
      
      setLoading(false);
    }, 1500);
  };

  // Validação de CPF
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verificação básica (não implementação completa)
    const invalidCPFs = [
      '00000000000', '11111111111', '22222222222', '33333333333',
      '44444444444', '55555555555', '66666666666', '77777777777',
      '88888888888', '99999999999'
    ];
    
    return !invalidCPFs.includes(cleanCPF);
  };

  // Formatação de CPF
  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Formatação de telefone
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Verificar vencimentos
  const checkExpiry = (date: string): { isExpired: boolean; isExpiringSoon: boolean; daysUntil: number } => {
    if (!date) return { isExpired: false, isExpiringSoon: false, daysUntil: 0 };
    
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntil = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      isExpired: daysUntil < 0,
      isExpiringSoon: daysUntil <= 90 && daysUntil >= 0,
      daysUntil
    };
  };

  const handleChange = (section: keyof UnifiedRegistrationData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Limpar erro se existir
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.owner.name.trim()) newErrors['owner.name'] = 'Nome do proprietário é obrigatório';
        if (!formData.owner.cpf.trim()) newErrors['owner.cpf'] = 'CPF do proprietário é obrigatório';
        else if (!validateCPF(formData.owner.cpf)) newErrors['owner.cpf'] = 'CPF inválido';
        if (!formData.operator.name.trim()) newErrors['operator.name'] = 'Nome do operador é obrigatório';
        if (!formData.operator.email.trim()) newErrors['operator.email'] = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(formData.operator.email)) newErrors['operator.email'] = 'Email inválido';
        if (!formData.operator.phone.trim()) newErrors['operator.phone'] = 'Telefone é obrigatório';
        break;
        
      case 2:
        if (!formData.aircraft.registration.trim()) newErrors['aircraft.registration'] = 'Matrícula é obrigatória';
        if (!formData.aircraft.manufacturer.trim()) newErrors['aircraft.manufacturer'] = 'Fabricante é obrigatório';
        if (!formData.aircraft.model.trim()) newErrors['aircraft.model'] = 'Modelo é obrigatório';
        if (!formData.aircraft.serialNumber.trim()) newErrors['aircraft.serialNumber'] = 'Número de série é obrigatório';
        break;
        
      case 3:
        if (!formData.engine.manufacturer.trim()) newErrors['engine.manufacturer'] = 'Fabricante do motor é obrigatório';
        if (!formData.engine.model.trim()) newErrors['engine.model'] = 'Modelo do motor é obrigatório';
        if (!formData.engine.serialNumber.trim()) newErrors['engine.serialNumber'] = 'Número de série do motor é obrigatório';
        break;
        
      case 4:
        if (!formData.propeller.manufacturer.trim()) newErrors['propeller.manufacturer'] = 'Fabricante da hélice é obrigatório';
        if (!formData.propeller.model.trim()) newErrors['propeller.model'] = 'Modelo da hélice é obrigatório';
        if (!formData.propeller.serialNumber.trim()) newErrors['propeller.serialNumber'] = 'Número de série da hélice é obrigatório';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Validar todos os passos
    let allValid = true;
    for (let i = 1; i <= 4; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (allValid) {
      onSave(formData);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadastro_${formData.aircraft.registration || 'aeronave'}_${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Proprietário */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Dados do Proprietário
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.owner.name}
                    onChange={(e) => handleChange('owner', 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors['owner.name'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['owner.name'] && <p className="mt-1 text-sm text-red-600">{errors['owner.name']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.owner.cpf}
                    onChange={(e) => handleChange('owner', 'cpf', formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors['owner.cpf'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['owner.cpf'] && <p className="mt-1 text-sm text-red-600">{errors['owner.cpf']}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Completo
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Rua/Avenida"
                        value={formData.owner.street}
                        onChange={(e) => handleChange('owner', 'street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Número"
                        value={formData.owner.number}
                        onChange={(e) => handleChange('owner', 'number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Complemento"
                        value={formData.owner.complement}
                        onChange={(e) => handleChange('owner', 'complement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={formData.owner.neighborhood}
                        onChange={(e) => handleChange('owner', 'neighborhood', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={formData.owner.city}
                        onChange={(e) => handleChange('owner', 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Estado"
                        value={formData.owner.state}
                        onChange={(e) => handleChange('owner', 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="CEP"
                        value={formData.owner.zipCode}
                        onChange={(e) => handleChange('owner', 'zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operador */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Dados do Operador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome/Razão Social *
                  </label>
                  <input
                    type="text"
                    value={formData.operator.name}
                    onChange={(e) => handleChange('operator', 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['operator.name'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['operator.name'] && <p className="mt-1 text-sm text-red-600">{errors['operator.name']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    value={formData.operator.cpf}
                    onChange={(e) => handleChange('operator', 'cpf', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    value={formData.operator.phone}
                    onChange={(e) => handleChange('operator', 'phone', formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['operator.phone'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['operator.phone'] && <p className="mt-1 text-sm text-red-600">{errors['operator.phone']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={formData.operator.email}
                    onChange={(e) => handleChange('operator', 'email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['operator.email'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['operator.email'] && <p className="mt-1 text-sm text-red-600">{errors['operator.email']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável Técnico
                  </label>
                  <input
                    type="text"
                    value={formData.operator.technicalResponsible}
                    onChange={(e) => handleChange('operator', 'technicalResponsible', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contato Alternativo
                  </label>
                  <input
                    type="text"
                    value={formData.operator.alternativeContact}
                    onChange={(e) => handleChange('operator', 'alternativeContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        const cvaExpiry = checkExpiry(formData.aircraft.cvaValidUntil);
        
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Dados da Aeronave
              </h3>
              
              {/* Consulta ANAC */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Consulta Automática ANAC</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Digite a matrícula (ex: PT-ABC)"
                    value={formData.aircraft.registration}
                    onChange={(e) => handleChange('aircraft', 'registration', e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => consultANAC(formData.aircraft.registration)}
                    disabled={loading || !formData.aircraft.registration.trim()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Search className="h-5 w-5 mr-2" />
                    )}
                    Consultar ANAC
                  </button>
                </div>
                {anacData && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-800">✓ Dados encontrados na ANAC e preenchidos automaticamente!</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft.registration}
                    onChange={(e) => handleChange('aircraft', 'registration', e.target.value.toUpperCase())}
                    placeholder="PT-ABC"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['aircraft.registration'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['aircraft.registration'] && <p className="mt-1 text-sm text-red-600">{errors['aircraft.registration']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricante *
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft.manufacturer}
                    onChange={(e) => handleChange('aircraft', 'manufacturer', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['aircraft.manufacturer'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['aircraft.manufacturer'] && <p className="mt-1 text-sm text-red-600">{errors['aircraft.manufacturer']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft.model}
                    onChange={(e) => handleChange('aircraft', 'model', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['aircraft.model'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['aircraft.model'] && <p className="mt-1 text-sm text-red-600">{errors['aircraft.model']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Série *
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft.serialNumber}
                    onChange={(e) => handleChange('aircraft', 'serialNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors['aircraft.serialNumber'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['aircraft.serialNumber'] && <p className="mt-1 text-sm text-red-600">{errors['aircraft.serialNumber']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano de Fabricação
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft.yearOfManufacture}
                    onChange={(e) => handleChange('aircraft', 'yearOfManufacture', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria da Aeronave
                  </label>
                  <select
                    value={formData.aircraft.category}
                    onChange={(e) => handleChange('aircraft', 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione</option>
                    <option value="Aviação Geral">Aviação Geral</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Experimental">Experimental</option>
                    <option value="Ultraleve">Ultraleve</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Certificação
                  </label>
                  <select
                    value={formData.aircraft.certificationType}
                    onChange={(e) => handleChange('aircraft', 'certificationType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione</option>
                    <option value="Padrão">Padrão</option>
                    <option value="Restrito">Restrito</option>
                    <option value="Experimental">Experimental</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVA Válido Até
                  </label>
                  <input
                    type="date"
                    value={formData.aircraft.cvaValidUntil}
                    onChange={(e) => handleChange('aircraft', 'cvaValidUntil', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      cvaExpiry.isExpired ? 'border-red-300 bg-red-50' : 
                      cvaExpiry.isExpiringSoon ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'
                    }`}
                  />
                  {cvaExpiry.isExpired && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      CVA VENCIDO há {Math.abs(cvaExpiry.daysUntil)} dias
                    </p>
                  )}
                  {cvaExpiry.isExpiringSoon && (
                    <p className="mt-1 text-sm text-yellow-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      CVA vence em {cvaExpiry.daysUntil} dias
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status de Aeronavegabilidade
                  </label>
                  <select
                    value={formData.aircraft.airworthinessStatus}
                    onChange={(e) => handleChange('aircraft', 'airworthinessStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                    <option value="interdicted">Interditada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horas Totais
                  </label>
                  <input
                    type="number"
                    value={formData.aircraft.totalHours}
                    onChange={(e) => handleChange('aircraft', 'totalHours', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Última Manutenção
                  </label>
                  <input
                    type="date"
                    value={formData.aircraft.lastMaintenance}
                    onChange={(e) => handleChange('aircraft', 'lastMaintenance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próxima Inspeção
                  </label>
                  <input
                    type="date"
                    value={formData.aircraft.nextInspection}
                    onChange={(e) => handleChange('aircraft', 'nextInspection', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Dados do Motor
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricante *
                  </label>
                  <input
                    type="text"
                    value={formData.engine.manufacturer}
                    onChange={(e) => handleChange('engine', 'manufacturer', e.target.value)}
                    placeholder="Ex: Lycoming"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      errors['engine.manufacturer'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['engine.manufacturer'] && <p className="mt-1 text-sm text-red-600">{errors['engine.manufacturer']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.engine.model}
                    onChange={(e) => handleChange('engine', 'model', e.target.value)}
                    placeholder="Ex: O-320-E2A"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      errors['engine.model'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['engine.model'] && <p className="mt-1 text-sm text-red-600">{errors['engine.model']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Série *
                  </label>
                  <input
                    type="text"
                    value={formData.engine.serialNumber}
                    onChange={(e) => handleChange('engine', 'serialNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      errors['engine.serialNumber'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['engine.serialNumber'] && <p className="mt-1 text-sm text-red-600">{errors['engine.serialNumber']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TSN (Time Since New)
                  </label>
                  <input
                    type="number"
                    value={formData.engine.tsn}
                    onChange={(e) => handleChange('engine', 'tsn', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TSO (Time Since Overhaul)
                  </label>
                  <input
                    type="number"
                    value={formData.engine.tso}
                    onChange={(e) => handleChange('engine', 'tso', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horímetro Atual
                  </label>
                  <input
                    type="number"
                    value={formData.engine.currentHours}
                    onChange={(e) => handleChange('engine', 'currentHours', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Última Revisão
                  </label>
                  <input
                    type="date"
                    value={formData.engine.lastRevision}
                    onChange={(e) => handleChange('engine', 'lastRevision', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vencimento Estimado
                  </label>
                  <input
                    type="date"
                    value={formData.engine.estimatedExpiry}
                    onChange={(e) => handleChange('engine', 'estimatedExpiry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Dados da Hélice
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricante *
                  </label>
                  <input
                    type="text"
                    value={formData.propeller.manufacturer}
                    onChange={(e) => handleChange('propeller', 'manufacturer', e.target.value)}
                    placeholder="Ex: McCauley"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors['propeller.manufacturer'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['propeller.manufacturer'] && <p className="mt-1 text-sm text-red-600">{errors['propeller.manufacturer']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.propeller.model}
                    onChange={(e) => handleChange('propeller', 'model', e.target.value)}
                    placeholder="Ex: 1C160/DTM7557"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors['propeller.model'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['propeller.model'] && <p className="mt-1 text-sm text-red-600">{errors['propeller.model']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Série *
                  </label>
                  <input
                    type="text"
                    value={formData.propeller.serialNumber}
                    onChange={(e) => handleChange('propeller', 'serialNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors['propeller.serialNumber'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['propeller.serialNumber'] && <p className="mt-1 text-sm text-red-600">{errors['propeller.serialNumber']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TSN (Time Since New)
                  </label>
                  <input
                    type="number"
                    value={formData.propeller.tsn}
                    onChange={(e) => handleChange('propeller', 'tsn', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TSO (Time Since Overhaul)
                  </label>
                  <input
                    type="number"
                    value={formData.propeller.tso}
                    onChange={(e) => handleChange('propeller', 'tso', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Última Revisão
                  </label>
                  <input
                    type="date"
                    value={formData.propeller.lastRevision}
                    onChange={(e) => handleChange('propeller', 'lastRevision', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próxima Revisão
                  </label>
                  <input
                    type="date"
                    value={formData.propeller.nextRevision}
                    onChange={(e) => handleChange('propeller', 'nextRevision', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Dados Complementares
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Entrada no Sistema
                  </label>
                  <input
                    type="date"
                    value={formData.additional.entryDate}
                    onChange={(e) => handleChange('additional', 'entryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Gerais
                  </label>
                  <textarea
                    value={formData.additional.generalNotes}
                    onChange={(e) => handleChange('additional', 'generalNotes', e.target.value)}
                    rows={4}
                    placeholder="Informações adicionais, histórico, peculiaridades..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload de Documentos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG até 10MB cada
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleChange('additional', 'documents', files);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo do Cadastro */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Cadastro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Proprietário</h4>
                  <p className="text-sm text-gray-600">{formData.owner.name || 'Não informado'}</p>
                  <p className="text-sm text-gray-600">{formData.owner.cpf || 'CPF não informado'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Aeronave</h4>
                  <p className="text-sm text-gray-600">{formData.aircraft.registration || 'Matrícula não informada'}</p>
                  <p className="text-sm text-gray-600">{formData.aircraft.model || 'Modelo não informado'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motor</h4>
                  <p className="text-sm text-gray-600">{formData.engine.manufacturer || 'Fabricante não informado'}</p>
                  <p className="text-sm text-gray-600">{formData.engine.model || 'Modelo não informado'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hélice</h4>
                  <p className="text-sm text-gray-600">{formData.propeller.manufacturer || 'Fabricante não informado'}</p>
                  <p className="text-sm text-gray-600">{formData.propeller.model || 'Modelo não informado'}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Cadastro Inicial Unificado</h1>
            <p className="text-gray-600">Complete todos os dados necessários em um único formulário</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToJSON}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            Backup JSON
          </button>
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
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  isActive 
                    ? `border-${step.color}-500 bg-${step.color}-500 text-white` 
                    : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? `text-${step.color}-600` : isCompleted ? 'text-green-600' : 'text-gray-500'
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

        <form onSubmit={(e) => e.preventDefault()}>
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
                Cancelar
              </button>

              {currentStep < 5 ? (
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
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Finalizar Cadastro
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};