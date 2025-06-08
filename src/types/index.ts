export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  owner: string;
  operator: string;
  acquisitionDate: string;
  status: 'active' | 'inactive' | 'sold';
  totalFlightHours: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  components: Component[];
  // Novos campos
  yearOfManufacture?: string;
  maxTakeoffWeight?: number;
  engineType?: string;
  enginePower?: number;
  fuelCapacity?: number;
  maxPassengers?: number;
  certificateType?: 'standard' | 'restricted' | 'experimental' | 'special';
  insuranceExpiry?: string;
  registrationExpiry?: string;
  notes?: string;
}

export interface Component {
  id: string;
  aircraftId: string;
  name: string;
  category: 'engine' | 'propeller' | 'landing-gear' | 'avionics' | 'other';
  partNumber: string;
  serialNumber: string;
  installationDate: string;
  flightHoursAtInstallation: number;
  maxFlightHours: number;
  nextInspectionDate: string;
  status: 'good' | 'warning' | 'critical' | 'expired';
}

export interface Maintenance {
  id: string;
  aircraftId: string;
  type: 'preventive' | 'corrective';
  description: string;
  date: string;
  flightHours: number;
  mechanicId: string;
  partsReplaced: Part[];
  cost: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  cost: number;
  supplier: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  aircraftIds: string[];
  lastContact?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mechanic' | 'manager' | 'customer';
  permissions: string[];
}

export interface Directive {
  id: string;
  type: 'SB' | 'AD' | 'circular';
  number: string;
  title: string;
  description: string;
  applicableAircraft: string[];
  effectiveDate: string;
  complianceDate?: string;
  status: 'active' | 'superseded' | 'cancelled';
  documentUrl?: string;
}