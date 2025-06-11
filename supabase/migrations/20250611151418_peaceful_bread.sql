/*
  # Views e Funções Úteis

  1. Views
    - `aircraft_with_owner` - Aeronaves com dados do proprietário
    - `maintenance_summary` - Resumo de manutenções por aeronave
    - `component_status_summary` - Resumo do status dos componentes
    - `upcoming_maintenances` - Manutenções próximas

  2. Funções
    - `get_aircraft_maintenance_status` - Status de manutenção de uma aeronave
    - `get_overdue_components` - Componentes vencidos
    - `calculate_component_remaining_hours` - Horas restantes de um componente
*/

-- View: Aeronaves com dados do proprietário
CREATE OR REPLACE VIEW aircraft_with_owner AS
SELECT 
  a.*,
  c.name as owner_name,
  c.email as owner_email,
  c.phone as owner_phone,
  c.company as owner_company
FROM aircraft a
LEFT JOIN customers c ON a.owner_id = c.id;

-- View: Resumo de manutenções por aeronave
CREATE OR REPLACE VIEW maintenance_summary AS
SELECT 
  a.id as aircraft_id,
  a.registration,
  COUNT(m.id) as total_maintenances,
  COUNT(CASE WHEN m.status = 'completed' THEN 1 END) as completed_maintenances,
  COUNT(CASE WHEN m.status = 'scheduled' THEN 1 END) as scheduled_maintenances,
  COUNT(CASE WHEN m.status = 'in-progress' THEN 1 END) as in_progress_maintenances,
  SUM(CASE WHEN m.status = 'completed' THEN m.cost ELSE 0 END) as total_maintenance_cost,
  MAX(CASE WHEN m.status = 'completed' THEN m.date END) as last_maintenance_date,
  MIN(CASE WHEN m.status = 'scheduled' THEN m.date END) as next_maintenance_date
FROM aircraft a
LEFT JOIN maintenances m ON a.id = m.aircraft_id
GROUP BY a.id, a.registration;

-- View: Resumo do status dos componentes
CREATE OR REPLACE VIEW component_status_summary AS
SELECT 
  a.id as aircraft_id,
  a.registration,
  COUNT(c.id) as total_components,
  COUNT(CASE WHEN c.status = 'good' THEN 1 END) as good_components,
  COUNT(CASE WHEN c.status = 'warning' THEN 1 END) as warning_components,
  COUNT(CASE WHEN c.status = 'critical' THEN 1 END) as critical_components,
  COUNT(CASE WHEN c.status = 'expired' THEN 1 END) as expired_components
FROM aircraft a
LEFT JOIN components c ON a.id = c.aircraft_id
GROUP BY a.id, a.registration;

-- View: Manutenções próximas (próximos 30 dias)
CREATE OR REPLACE VIEW upcoming_maintenances AS
SELECT 
  m.*,
  a.registration,
  a.model,
  c.name as owner_name,
  c.email as owner_email,
  c.phone as owner_phone,
  (m.date - CURRENT_DATE) as days_until_maintenance
FROM maintenances m
JOIN aircraft a ON m.aircraft_id = a.id
LEFT JOIN customers c ON a.owner_id = c.id
WHERE m.status = 'scheduled' 
  AND m.date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
ORDER BY m.date ASC;

-- Função: Obter status de manutenção de uma aeronave
CREATE OR REPLACE FUNCTION get_aircraft_maintenance_status(aircraft_uuid uuid)
RETURNS TABLE (
  status text,
  days_until_next integer,
  overdue_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN COUNT(CASE WHEN m.date < CURRENT_DATE AND m.status = 'scheduled' THEN 1 END) > 0 THEN 'overdue'
      WHEN COUNT(CASE WHEN m.date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days') AND m.status = 'scheduled' THEN 1 END) > 0 THEN 'urgent'
      WHEN COUNT(CASE WHEN m.date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days') AND m.status = 'scheduled' THEN 1 END) > 0 THEN 'upcoming'
      ELSE 'ok'
    END::text as status,
    COALESCE(MIN(CASE WHEN m.status = 'scheduled' AND m.date >= CURRENT_DATE THEN (m.date - CURRENT_DATE) END), 0)::integer as days_until_next,
    COUNT(CASE WHEN m.date < CURRENT_DATE AND m.status = 'scheduled' THEN 1 END)::integer as overdue_count
  FROM maintenances m
  WHERE m.aircraft_id = aircraft_uuid;
END;
$$ LANGUAGE plpgsql;

-- Função: Obter componentes vencidos
CREATE OR REPLACE FUNCTION get_overdue_components()
RETURNS TABLE (
  component_id uuid,
  aircraft_id uuid,
  aircraft_registration text,
  component_name text,
  part_number text,
  next_inspection_date date,
  days_overdue integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.aircraft_id,
    a.registration,
    c.name,
    c.part_number,
    c.next_inspection_date,
    (CURRENT_DATE - c.next_inspection_date)::integer as days_overdue
  FROM components c
  JOIN aircraft a ON c.aircraft_id = a.id
  WHERE c.next_inspection_date < CURRENT_DATE
    AND c.status IN ('critical', 'expired')
  ORDER BY c.next_inspection_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Função: Calcular horas restantes de um componente
CREATE OR REPLACE FUNCTION calculate_component_remaining_hours(
  component_uuid uuid,
  current_aircraft_hours numeric
)
RETURNS numeric AS $$
DECLARE
  component_record components%ROWTYPE;
  hours_used numeric;
  hours_remaining numeric;
BEGIN
  SELECT * INTO component_record FROM components WHERE id = component_uuid;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  hours_used := current_aircraft_hours - component_record.flight_hours_at_installation;
  hours_remaining := component_record.max_flight_hours - hours_used;
  
  RETURN GREATEST(hours_remaining, 0);
END;
$$ LANGUAGE plpgsql;