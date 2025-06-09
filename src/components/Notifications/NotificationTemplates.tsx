import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, Edit, Trash2, Plus, Save, X } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'system';
  subject: string;
  message: string;
  variables: string[];
  category: 'maintenance' | 'component' | 'regulatory' | 'general';
}

interface NotificationTemplatesProps {
  onTemplateSelect: (template: NotificationTemplate) => void;
}

export const NotificationTemplates: React.FC<NotificationTemplatesProps> = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Lembrete de Manutenção Preventiva',
      type: 'email',
      subject: 'Manutenção Programada - {aircraftRegistration}',
      message: 'Olá {customerName},\n\nSua aeronave {aircraftRegistration} ({aircraftModel}) possui uma manutenção preventiva programada para {maintenanceDate}.\n\nDetalhes:\n- Tipo: {maintenanceType}\n- Horas atuais: {currentHours}h\n- Descrição: {maintenanceDescription}\n\nPor favor, entre em contato conosco para confirmar o agendamento.\n\nAtenciosamente,\nEquipe de Manutenção',
      variables: ['customerName', 'aircraftRegistration', 'aircraftModel', 'maintenanceDate', 'maintenanceType', 'currentHours', 'maintenanceDescription'],
      category: 'maintenance'
    },
    {
      id: '2',
      name: 'Vencimento de Componente',
      type: 'email',
      subject: 'Atenção: Componente próximo ao vencimento - {aircraftRegistration}',
      message: 'Olá {customerName},\n\nO componente {componentName} (P/N: {partNumber}) da sua aeronave {aircraftRegistration} está próximo do vencimento.\n\nInformações:\n- Data de vencimento: {expiryDate}\n- Horas máximas: {maxHours}h\n- Horas atuais: {currentHours}h\n\nRecomendamos agendar a substituição o quanto antes para evitar a indisponibilidade da aeronave.\n\nAtenciosamente,\nEquipe Técnica',
      variables: ['customerName', 'aircraftRegistration', 'componentName', 'partNumber', 'expiryDate', 'maxHours', 'currentHours'],
      category: 'component'
    },
    {
      id: '3',
      name: 'Nova Diretriz ANAC',
      type: 'email',
      subject: 'Nova Diretriz Aplicável - {directiveNumber}',
      message: 'Olá {customerName},\n\nUma nova diretriz da ANAC foi publicada e se aplica à sua aeronave {aircraftRegistration}.\n\nDiretriz: {directiveNumber} - {directiveTitle}\nData de cumprimento: {complianceDate}\nDescrição: {directiveDescription}\n\nEntraremos em contato para agendar os serviços necessários.\n\nAtenciosamente,\nEquipe Técnica',
      variables: ['customerName', 'aircraftRegistration', 'directiveNumber', 'directiveTitle', 'complianceDate', 'directiveDescription'],
      category: 'regulatory'
    },
    {
      id: '4',
      name: 'WhatsApp - Lembrete Rápido',
      type: 'whatsapp',
      subject: '',
      message: 'Olá {customerName}! 👋\n\nLembrando que sua aeronave {aircraftRegistration} tem manutenção agendada para {maintenanceDate}.\n\nConfirma o horário? 🛩️\n\nEquipe HangarHouse',
      variables: ['customerName', 'aircraftRegistration', 'maintenanceDate'],
      category: 'maintenance'
    },
    {
      id: '5',
      name: 'Manutenção Concluída',
      type: 'email',
      subject: 'Manutenção Concluída - {aircraftRegistration}',
      message: 'Olá {customerName},\n\nA manutenção da sua aeronave {aircraftRegistration} foi concluída com sucesso!\n\nServiços realizados:\n{servicesPerformed}\n\nPeças substituídas:\n{partsReplaced}\n\nCusto total: R$ {totalCost}\n\nSua aeronave está liberada para voo.\n\nAtenciosamente,\nEquipe de Manutenção',
      variables: ['customerName', 'aircraftRegistration', 'servicesPerformed', 'partsReplaced', 'totalCost'],
      category: 'maintenance'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as 'email' | 'whatsapp' | 'system',
    subject: '',
    message: '',
    category: 'general' as 'maintenance' | 'component' | 'regulatory' | 'general'
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5 text-blue-500" />;
      case 'whatsapp': return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'system': return <Bell className="h-5 w-5 text-purple-500" />;
      default: return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'component': return 'bg-orange-100 text-orange-800';
      case 'regulatory': return 'bg-red-100 text-red-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'maintenance': return 'Manutenção';
      case 'component': return 'Componentes';
      case 'regulatory': return 'Regulatório';
      case 'general': return 'Geral';
      default: return category;
    }
  };

  const extractVariables = (message: string): string[] => {
    const matches = message.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const handleSaveTemplate = () => {
    const variables = extractVariables(formData.message);
    
    const templateData: NotificationTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      ...formData,
      variables
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? templateData : t));
    } else {
      setTemplates(prev => [...prev, templateData]);
    }

    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: '', type: 'email', subject: '', message: '', category: 'general' });
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject,
      message: template.message,
      category: template.category
    });
    setShowForm(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingTemplate ? 'Editar Modelo' : 'Novo Modelo de Notificação'}
          </h3>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingTemplate(null);
              setFormData({ name: '', type: 'email', subject: '', message: '', category: 'general' });
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Modelo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Lembrete de Manutenção"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Notificação
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="general">Geral</option>
                <option value="maintenance">Manutenção</option>
                <option value="component">Componentes</option>
                <option value="regulatory">Regulatório</option>
              </select>
            </div>

            {formData.type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Assunto do email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={8}
              placeholder="Digite a mensagem. Use {variavel} para campos dinâmicos como {customerName}, {aircraftRegistration}, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use chaves para variáveis: {'{customerName}'}, {'{aircraftRegistration}'}, {'{maintenanceDate}'}, etc.
            </p>
          </div>

          {formData.message && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Variáveis Detectadas:</h4>
              <div className="flex flex-wrap gap-2">
                {extractVariables(formData.message).map((variable, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTemplate(null);
                setFormData({ name: '', type: 'email', subject: '', message: '', category: 'general' });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveTemplate}
              disabled={!formData.name || !formData.message}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Modelo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Modelos de Notificação</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getTypeIcon(template.type)}
                <div>
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {getCategoryText(template.category)}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{template.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {template.subject && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">Assunto:</p>
                <p className="text-sm text-gray-600 truncate">{template.subject}</p>
              </div>
            )}

            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-3">{template.message}</p>
            </div>

            {template.variables.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Variáveis:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 3).map((variable, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {variable}
                    </span>
                  ))}
                  {template.variables.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{template.variables.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => onTemplateSelect(template)}
              className="w-full px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors duration-200 text-sm font-medium"
            >
              Usar Modelo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};