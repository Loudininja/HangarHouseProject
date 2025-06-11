/*
  # Tabela de Clientes

  1. Nova Tabela
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `company` (text)
      - `cpf_cnpj` (text)
      - `birth_date` (date)
      - `profession` (text)
      - `emergency_contact` (text)
      - `emergency_phone` (text)
      - `preferred_contact` (enum)
      - `address` (text)
      - `street` (text)
      - `number` (text)
      - `complement` (text)
      - `neighborhood` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `country` (text)
      - `notes` (text)
      - `last_contact` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `customers`
    - Políticas para usuários autenticados lerem e gerenciarem clientes
*/

-- Criar enum para tipo de contato preferido
CREATE TYPE contact_preference AS ENUM ('email', 'phone', 'whatsapp');

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  company text,
  cpf_cnpj text,
  birth_date date,
  profession text,
  emergency_contact text,
  emergency_phone text,
  preferred_contact contact_preference DEFAULT 'email',
  address text,
  street text,
  number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'Brasil',
  notes text,
  last_contact date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();