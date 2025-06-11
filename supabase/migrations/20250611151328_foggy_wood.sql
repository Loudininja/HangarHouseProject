/*
  # Tabela de Diretrizes

  1. Nova Tabela
    - `directives`
      - `id` (uuid, primary key)
      - `type` (enum)
      - `number` (text, unique)
      - `title` (text)
      - `description` (text)
      - `effective_date` (date)
      - `compliance_date` (date)
      - `status` (enum)
      - `document_url` (text)
      - `applicable_models` (text array)
      - `applicable_serial_numbers` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `directives`
    - Políticas para usuários autenticados lerem e gerenciarem diretrizes
*/

-- Criar enums
CREATE TYPE directive_type AS ENUM ('AD', 'SB', 'circular');
CREATE TYPE directive_status AS ENUM ('active', 'superseded', 'cancelled');

-- Criar tabela de diretrizes
CREATE TABLE IF NOT EXISTS directives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type directive_type NOT NULL,
  number text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  effective_date date NOT NULL,
  compliance_date date,
  status directive_status DEFAULT 'active',
  document_url text,
  applicable_models text[],
  applicable_serial_numbers text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE directives ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read directives"
  ON directives
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage directives"
  ON directives
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_directives_updated_at
  BEFORE UPDATE ON directives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_directives_number ON directives(number);
CREATE INDEX IF NOT EXISTS idx_directives_type ON directives(type);
CREATE INDEX IF NOT EXISTS idx_directives_status ON directives(status);
CREATE INDEX IF NOT EXISTS idx_directives_compliance_date ON directives(compliance_date);