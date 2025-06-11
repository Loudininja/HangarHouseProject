/*
  # Dados Iniciais do Sistema

  1. Configurações Padrão
    - Configurações gerais do sistema
    - Configurações de notificação
    - Configurações de segurança

  2. Modelos de Notificação Padrão
    - Lembrete de manutenção preventiva
    - Vencimento de componente
    - Nova diretriz ANAC
    - WhatsApp lembrete rápido
    - Manutenção concluída
*/

-- Inserir configurações padrão
INSERT INTO settings (key, value, description, category, is_public) VALUES
  ('company_name', '"HangarHouse"', 'Nome da empresa', 'general', true),
  ('timezone', '"America/Sao_Paulo"', 'Fuso horário padrão', 'general', true),
  ('language', '"pt-BR"', 'Idioma padrão do sistema', 'general', true),
  ('currency', '"BRL"', 'Moeda padrão', 'general', true),
  ('date_format', '"dd/MM/yyyy"', 'Formato de data padrão', 'general', true),
  ('email_notifications', 'true', 'Habilitar notificações por email', 'notifications', false),
  ('whatsapp_notifications', 'false', 'Habilitar notificações por WhatsApp', 'notifications', false),
  ('maintenance_reminders', 'true', 'Habilitar lembretes de manutenção', 'notifications', false),
  ('component_alerts', 'true', 'Habilitar alertas de componentes', 'notifications', false),
  ('session_timeout', '30', 'Timeout de sessão em minutos', 'security', false),
  ('password_expiry', '90', 'Expiração de senha em dias', 'security', false),
  ('two_factor_auth', 'false', 'Exigir autenticação de dois fatores', 'security', false),
  ('login_attempts', '5', 'Máximo de tentativas de login', 'security', false),
  ('auto_backup', 'true', 'Habilitar backup automático', 'system', false),
  ('backup_frequency', '"daily"', 'Frequência de backup', 'system', false),
  ('data_retention', '365', 'Retenção de dados em dias', 'system', false)
ON CONFLICT (key) DO NOTHING;

-- Inserir modelos de notificação padrão
INSERT INTO notification_templates (name, type, subject, message, variables, category) VALUES
  (
    'Lembrete de Manutenção Preventiva',
    'email',
    'Manutenção Programada - {aircraftRegistration}',
    'Olá {customerName},

Sua aeronave {aircraftRegistration} ({aircraftModel}) possui uma manutenção preventiva programada para {maintenanceDate}.

Detalhes:
- Tipo: {maintenanceType}
- Horas atuais: {currentHours}h
- Descrição: {maintenanceDescription}

Por favor, entre em contato conosco para confirmar o agendamento.

Atenciosamente,
Equipe de Manutenção',
    ARRAY['customerName', 'aircraftRegistration', 'aircraftModel', 'maintenanceDate', 'maintenanceType', 'currentHours', 'maintenanceDescription'],
    'maintenance'
  ),
  (
    'Vencimento de Componente',
    'email',
    'Atenção: Componente próximo ao vencimento - {aircraftRegistration}',
    'Olá {customerName},

O componente {componentName} (P/N: {partNumber}) da sua aeronave {aircraftRegistration} está próximo do vencimento.

Informações:
- Data de vencimento: {expiryDate}
- Horas máximas: {maxHours}h
- Horas atuais: {currentHours}h

Recomendamos agendar a substituição o quanto antes para evitar a indisponibilidade da aeronave.

Atenciosamente,
Equipe Técnica',
    ARRAY['customerName', 'aircraftRegistration', 'componentName', 'partNumber', 'expiryDate', 'maxHours', 'currentHours'],
    'component'
  ),
  (
    'Nova Diretriz ANAC',
    'email',
    'Nova Diretriz Aplicável - {directiveNumber}',
    'Olá {customerName},

Uma nova diretriz da ANAC foi publicada e se aplica à sua aeronave {aircraftRegistration}.

Diretriz: {directiveNumber} - {directiveTitle}
Data de cumprimento: {complianceDate}
Descrição: {directiveDescription}

Entraremos em contato para agendar os serviços necessários.

Atenciosamente,
Equipe Técnica',
    ARRAY['customerName', 'aircraftRegistration', 'directiveNumber', 'directiveTitle', 'complianceDate', 'directiveDescription'],
    'regulatory'
  ),
  (
    'WhatsApp - Lembrete Rápido',
    'whatsapp',
    '',
    'Olá {customerName}! 👋

Lembrando que sua aeronave {aircraftRegistration} tem manutenção agendada para {maintenanceDate}.

Confirma o horário? 🛩️

Equipe HangarHouse',
    ARRAY['customerName', 'aircraftRegistration', 'maintenanceDate'],
    'maintenance'
  ),
  (
    'Manutenção Concluída',
    'email',
    'Manutenção Concluída - {aircraftRegistration}',
    'Olá {customerName},

A manutenção da sua aeronave {aircraftRegistration} foi concluída com sucesso!

Serviços realizados:
{servicesPerformed}

Peças substituídas:
{partsReplaced}

Custo total: R$ {totalCost}

Sua aeronave está liberada para voo.

Atenciosamente,
Equipe de Manutenção',
    ARRAY['customerName', 'aircraftRegistration', 'servicesPerformed', 'partsReplaced', 'totalCost'],
    'maintenance'
  );