/*
  # Tabela de Manutenções

  1. Nova Tabela
    - `maintenances`
      - `id` (uuid, primary key)
      - `aircraft_id` (uuid, foreign key)
      - `type` (enum)
      - `description` (text)
      - `date` (date)
      - `flight_hours` (numeric)
      - `mechanic_id` (uuid, foreign key)
      - `cost` (numeric)
      - `status` (enum)
      - `priority` (enum)
      - `estimated_duration` (text)
      - `work_order_number` (text)
      - `customer_notified` (boolean)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `maintenances`
    - Políticas para usuários autenticados lerem e gerenciarem manutenções
*/

-- Criar enums
CREATE TYPE maintenance_type AS ENUM ('preventive', 'corrective');
CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in-progress', 'completed', 'cancelled');
CREATE TYPE maintenance_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- Criar tabela de manutenções
CREATE TABLE IF NOT EXISTS maintenances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id uuid NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  type maintenance_type NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  flight_hours numeric DEFAULT 0,
  mechanic_id uuid REFERENCES users(id),
  cost numeric DEFAULT 0,
  status maintenance_status DEFAULT 'scheduled',
  priority maintenance_priority DEFAULT 'normal',
  estimated_duration text,
  work_order_number text,
  customer_notified boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE maintenances ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read maintenances"
  ON maintenances
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage maintenances"
  ON maintenances
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_maintenances_updated_at
  BEFORE UPDATE ON maintenances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_maintenances_aircraft ON maintenances(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_mechanic ON maintenances(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_status ON maintenances(status);
CREATE INDEX IF NOT EXISTS idx_maintenances_date ON maintenances(date);