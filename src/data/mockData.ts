import { Aircraft, Customer, Maintenance, Component, Directive } from '../types';

export const mockAircraft: Aircraft[] = [
  {
    id: '1',
    registration: 'PT-ABC',
    model: 'Cessna 172',
    manufacturer: 'Cessna',
    serialNumber: '17280001',
    owner: 'João Silva',
    operator: 'Escola de Aviação Alpha',
    acquisitionDate: '2020-03-15',
    status: 'active',
    totalFlightHours: 2450,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    components: []
  },
  {
    id: '2',
    registration: 'PT-XYZ',
    model: 'Piper Cherokee',
    manufacturer: 'Piper',
    serialNumber: '28-7405001',
    owner: 'Maria Santos',
    operator: 'Táxi Aéreo Beta',
    acquisitionDate: '2019-08-22',
    status: 'active',
    totalFlightHours: 3200,
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    components: []
  },
  {
    id: '3',
    registration: 'PT-DEF',
    model: 'Embraer EMB-110',
    manufacturer: 'Embraer',
    serialNumber: '110001',
    owner: 'Companhia Aérea Gamma',
    operator: 'Companhia Aérea Gamma',
    acquisitionDate: '2018-12-10',
    status: 'active',
    totalFlightHours: 8500,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-03-20',
    components: []
  }
];

export const mockComponents: Component[] = [
  {
    id: '1',
    aircraftId: '1',
    name: 'Motor Lycoming O-320',
    category: 'engine',
    partNumber: 'O-320-E2A',
    serialNumber: 'L-12345',
    installationDate: '2020-03-15',
    flightHoursAtInstallation: 0,
    maxFlightHours: 2000,
    nextInspectionDate: '2024-06-15',
    status: 'warning'
  },
  {
    id: '2',
    aircraftId: '1',
    name: 'Hélice McCauley',
    category: 'propeller',
    partNumber: '1C160/DTM7557',
    serialNumber: 'MC-67890',
    installationDate: '2020-03-15',
    flightHoursAtInstallation: 0,
    maxFlightHours: 3000,
    nextInspectionDate: '2024-09-15',
    status: 'good'
  },
  {
    id: '3',
    aircraftId: '2',
    name: 'Trem de Pouso Principal',
    category: 'landing-gear',
    partNumber: 'LG-MAIN-001',
    serialNumber: 'LG-56789',
    installationDate: '2019-08-22',
    flightHoursAtInstallation: 500,
    maxFlightHours: 5000,
    nextInspectionDate: '2024-12-22',
    status: 'good'
  },
  {
    id: '4',
    aircraftId: '3',
    name: 'Aviónico Garmin G1000',
    category: 'avionics',
    partNumber: 'G1000-001',
    serialNumber: 'AV-11111',
    installationDate: '2018-12-10',
    flightHoursAtInstallation: 2000,
    maxFlightHours: 10000,
    nextInspectionDate: '2024-03-10',
    status: 'critical'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-0001',
    company: 'Escola de Aviação Alpha',
    address: 'Rua da Aviação, 123 - São Paulo, SP',
    aircraftIds: ['1'],
    lastContact: '2024-02-28'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 99999-0002',
    company: 'Táxi Aéreo Beta',
    address: 'Av. dos Pilotos, 456 - Rio de Janeiro, RJ',
    aircraftIds: ['2'],
    lastContact: '2024-02-25'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@gamma.com.br',
    phone: '(11) 99999-0003',
    company: 'Companhia Aérea Gamma',
    address: 'Terminal de Cargas, Aeroporto de Congonhas - São Paulo, SP',
    aircraftIds: ['3'],
    lastContact: '2024-03-01'
  }
];

export const mockMaintenances: Maintenance[] = [
  {
    id: '1',
    aircraftId: '1',
    type: 'preventive',
    description: 'Inspeção de 100 horas',
    date: '2024-01-15',
    flightHours: 2400,
    mechanicId: 'mech-1',
    partsReplaced: [],
    cost: 2500,
    status: 'completed',
    notes: 'Inspeção realizada conforme manual. Tudo em ordem.'
  },
  {
    id: '2',
    aircraftId: '2',
    type: 'corrective',
    description: 'Troca de pneu do trem principal',
    date: '2024-02-01',
    flightHours: 3150,
    mechanicId: 'mech-2',
    partsReplaced: [
      {
        id: 'part-1',
        name: 'Pneu Michelin 600x6',
        partNumber: 'AIR-600x6',
        quantity: 1,
        cost: 450,
        supplier: 'Michelin Brasil'
      }
    ],
    cost: 650,
    status: 'completed'
  },
  {
    id: '3',
    aircraftId: '3',
    type: 'preventive',
    description: 'Revisão Anual',
    date: '2024-03-20',
    flightHours: 8500,
    mechanicId: 'mech-1',
    partsReplaced: [],
    cost: 15000,
    status: 'scheduled'
  },
  {
    id: '4',
    aircraftId: '1',
    type: 'preventive',
    description: 'Inspeção de 50 horas',
    date: '2024-04-10',
    flightHours: 2500,
    mechanicId: 'mech-1',
    partsReplaced: [],
    cost: 1200,
    status: 'scheduled'
  },
  {
    id: '5',
    aircraftId: '2',
    type: 'corrective',
    description: 'Reparo no sistema hidráulico',
    date: '2024-03-25',
    flightHours: 3200,
    mechanicId: 'mech-2',
    partsReplaced: [
      {
        id: 'part-2',
        name: 'Filtro Hidráulico',
        partNumber: 'HYD-001',
        quantity: 2,
        cost: 150,
        supplier: 'Parker Hannifin'
      }
    ],
    cost: 800,
    status: 'in-progress'
  }
];

export const mockDirectives: Directive[] = [
  {
    id: '1',
    type: 'AD',
    number: 'AD 2024-001',
    title: 'Inspeção de Componentes de Motor Lycoming',
    description: 'Inspeção obrigatória de componentes específicos do motor Lycoming O-320 devido a falhas reportadas em campo',
    applicableAircraft: ['PT-ABC'],
    effectiveDate: '2024-01-01',
    complianceDate: '2024-06-01',
    status: 'active',
    documentUrl: 'https://anac.gov.br/ad/2024-001.pdf'
  },
  {
    id: '2',
    type: 'SB',
    number: 'SB CESSNA-001',
    title: 'Modificação do Sistema Elétrico',
    description: 'Service Bulletin para modificação do sistema elétrico em aeronaves Cessna 172 para melhoria de confiabilidade',
    applicableAircraft: ['PT-ABC'],
    effectiveDate: '2024-02-01',
    status: 'active'
  },
  {
    id: '3',
    type: 'circular',
    number: 'CC 2024-005',
    title: 'Procedimentos de Inspeção Visual',
    description: 'Carta circular estabelecendo novos procedimentos para inspeção visual de estruturas de aeronaves',
    applicableAircraft: ['PT-ABC', 'PT-XYZ', 'PT-DEF'],
    effectiveDate: '2024-03-01',
    status: 'active'
  },
  {
    id: '4',
    type: 'AD',
    number: 'AD 2023-045',
    title: 'Verificação de Componentes Piper',
    description: 'Diretriz para verificação de componentes específicos em aeronaves Piper Cherokee',
    applicableAircraft: ['PT-XYZ'],
    effectiveDate: '2023-12-01',
    complianceDate: '2024-05-01',
    status: 'active'
  }
];