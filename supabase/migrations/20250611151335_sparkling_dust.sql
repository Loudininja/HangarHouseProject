/*
  # Tabela de Relacionamento Aeronaves-Diretrizes

  1. Nova Tabela
    - `aircraft_directives`
      - `id` (uuid, primary key)
      - `aircraft_id` (uuid, foreign key)
      - `directive_id` (uuid, foreign key)
      - `compliance_status` (enum)
      - `compliance_date` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `aircraft_directives`
    - Políticas para usuários autenticados lerem e gerenciarem relacionamentos
*/

-- Criar enum
CREATE TYPE compliance_status AS ENUM ('pending', 'in-progress', 'completed', 'not-applicable');

-- Criar tabela de relacionamento aeronaves-diretrizes
CREATE TABLE IF NOT EXISTS aircraft_directives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id uuid NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  directive_id uuid NOT NULL REFERENCES directives(id) ON DELETE CASCADE,
  compliance_status compliance_status DEFAULT 'pending',
  compliance_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(aircraft_id, directive_id)
);

-- Habilitar RLS
ALTER TABLE aircraft_directives ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read aircraft directives"
  ON aircraft_directives
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage aircraft directives"
  ON aircraft_directives
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_aircraft_directives_updated_at
  BEFORE UPDATE ON aircraft_directives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_aircraft_directives_aircraft ON aircraft_directives(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_directives_directive ON aircraft_directives(directive_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_directives_status ON aircraft_directives(compliance_status);