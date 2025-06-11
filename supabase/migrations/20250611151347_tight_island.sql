/*
  # Tabela de Modelos de Notificação

  1. Nova Tabela
    - `notification_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum)
      - `subject` (text)
      - `message` (text)
      - `variables` (text array)
      - `category` (enum)
      - `is_active` (boolean)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `notification_templates`
    - Políticas para usuários autenticados lerem e gerenciarem modelos
*/

-- Criar enum
CREATE TYPE template_category AS ENUM ('maintenance', 'component', 'regulatory', 'general');

-- Criar tabela de modelos de notificação
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type notification_type NOT NULL,
  subject text,
  message text NOT NULL,
  variables text[],
  category template_category DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read notification templates"
  ON notification_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage notification templates"
  ON notification_templates
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON notification_templates(type);
CREATE INDEX IF NOT EXISTS idx_notification_templates_category ON notification_templates(category);
CREATE INDEX IF NOT EXISTS idx_notification_templates_active ON notification_templates(is_active);