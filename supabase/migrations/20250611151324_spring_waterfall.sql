/*
  # Tabela de Peças

  1. Nova Tabela
    - `parts`
      - `id` (uuid, primary key)
      - `maintenance_id` (uuid, foreign key)
      - `name` (text)
      - `part_number` (text)
      - `quantity` (integer)
      - `cost` (numeric)
      - `supplier` (text)
      - `serial_number` (text)
      - `installation_date` (date)
      - `warranty_expiry` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `parts`
    - Políticas para usuários autenticados lerem e gerenciarem peças
*/

-- Criar tabela de peças
CREATE TABLE IF NOT EXISTS parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id uuid NOT NULL REFERENCES maintenances(id) ON DELETE CASCADE,
  name text NOT NULL,
  part_number text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  cost numeric NOT NULL DEFAULT 0,
  supplier text,
  serial_number text,
  installation_date date,
  warranty_expiry date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read parts"
  ON parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage parts"
  ON parts
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_parts_updated_at
  BEFORE UPDATE ON parts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_parts_maintenance ON parts(maintenance_id);
CREATE INDEX IF NOT EXISTS idx_parts_part_number ON parts(part_number);