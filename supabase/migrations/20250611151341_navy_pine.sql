/*
  # Tabela de Notificações

  1. Nova Tabela
    - `notifications`
      - `id` (uuid, primary key)
      - `type` (enum)
      - `recipient_id` (uuid, foreign key)
      - `subject` (text)
      - `message` (text)
      - `scheduled_date` (date)
      - `sent_date` (timestamp)
      - `status` (enum)
      - `aircraft_id` (uuid, foreign key)
      - `maintenance_id` (uuid, foreign key)
      - `template_used` (text)
      - `error_message` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `notifications`
    - Políticas para usuários autenticados lerem e gerenciarem notificações
*/

-- Criar enums
CREATE TYPE notification_type AS ENUM ('email', 'whatsapp', 'system');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  recipient_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subject text,
  message text NOT NULL,
  scheduled_date date NOT NULL,
  sent_date timestamptz,
  status notification_status DEFAULT 'pending',
  aircraft_id uuid REFERENCES aircraft(id),
  maintenance_id uuid REFERENCES maintenances(id),
  template_used text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Authenticated users can read notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_date ON notifications(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_notifications_aircraft ON notifications(aircraft_id);