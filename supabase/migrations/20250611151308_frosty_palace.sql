/*
  # Tabela de Componentes

  1. Nova Tabela
    - `components`
      - `id` (uuid, primary key)
      - `aircraft_id` (uuid, foreign key)
      - `name` (text)
      - `category` (enum)
      - `part_number` (text)
      - `serial_number` (text)
      - `installation_date` (date)
      - `flight_hours_at_installation` (numeric)
      - `max_flight_hours` (numeric)
      - `next_inspection_date` (date)
      - `status` (enum)
      - `manufacturer` (text)
      - `supplier` (text)
      - `cost` (numeric)
      - `warranty_expiry` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `components`
    - Políticas para usuários autenticados lerem e gerenciarem componentes
*/

-- Criar enums
CREATE TYPE component_category AS ENUM ('engine', 'propeller', 'landing-gear', 'avionics', 'other');
CREATE TYPE component_status AS ENUM ('good', 'warning', 'critical', 'expired');

-- Criar tabela de componentes
CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id uuid NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  name text NOT NULL,
  category component_category NOT NULL,
  part_number text NOT NULL,
  serial_number text NOT NULL,
  installation_date date NOT NULL,
  flight_hours_at_installation numeric DEFAULT 0,
  max_flight_hours numeric NOT NULL,
  next_inspection_date date NOT NULL,
  status component_status DEFAULT 'good',
  manufacturer text,
  supplier text,
  cost numeric DEFAULT 0,
  warranty_expiry date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read components"
  ON components
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage components"
  ON components
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_components_aircraft ON components(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_components_status ON components(status);
CREATE INDEX IF NOT EXISTS idx_components_next_inspection ON components(next_inspection_date);