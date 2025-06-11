/*
  # Tabela de Aeronaves

  1. Nova Tabela
    - `aircraft`
      - `id` (uuid, primary key)
      - `registration` (text, unique)
      - `model` (text)
      - `manufacturer` (text)
      - `serial_number` (text)
      - `year_of_manufacture` (text)
      - `owner_id` (uuid, foreign key)
      - `operator` (text)
      - `acquisition_date` (date)
      - `status` (enum)
      - `total_flight_hours` (numeric)
      - `max_takeoff_weight` (numeric)
      - `engine_type` (text)
      - `engine_power` (numeric)
      - `fuel_capacity` (numeric)
      - `max_passengers` (integer)
      - `certificate_type` (enum)
      - `last_maintenance` (date)
      - `next_maintenance` (date)
      - `insurance_expiry` (date)
      - `registration_expiry` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `aircraft`
    - Políticas para usuários autenticados lerem e gerenciarem aeronaves
*/

-- Criar enums
CREATE TYPE aircraft_status AS ENUM ('active', 'inactive', 'sold');
CREATE TYPE certificate_type AS ENUM ('standard', 'restricted', 'experimental', 'special');

-- Criar tabela de aeronaves
CREATE TABLE IF NOT EXISTS aircraft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration text UNIQUE NOT NULL,
  model text NOT NULL,
  manufacturer text NOT NULL,
  serial_number text NOT NULL,
  year_of_manufacture text,
  owner_id uuid REFERENCES customers(id),
  operator text NOT NULL,
  acquisition_date date NOT NULL,
  status aircraft_status DEFAULT 'active',
  total_flight_hours numeric DEFAULT 0,
  max_takeoff_weight numeric,
  engine_type text,
  engine_power numeric,
  fuel_capacity numeric,
  max_passengers integer,
  certificate_type certificate_type DEFAULT 'standard',
  last_maintenance date,
  next_maintenance date,
  insurance_expiry date,
  registration_expiry date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read aircraft"
  ON aircraft
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage aircraft"
  ON aircraft
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_aircraft_updated_at
  BEFORE UPDATE ON aircraft
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_aircraft_registration ON aircraft(registration);
CREATE INDEX IF NOT EXISTS idx_aircraft_owner ON aircraft(owner_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_status ON aircraft(status);