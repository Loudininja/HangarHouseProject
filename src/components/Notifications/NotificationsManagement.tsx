import React, { useState } from 'react';
import { Bell, Mail, Phone, Send, Users, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { mockCustomers, mockAircraft, mockMaintenances } from '../../data/mockData';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'email' | 'whatsapp' | 'system';
  recipient: string;
  subject: string;
  message: string;
  scheduledDate: string;
  status: 'pending' | 'sent' | 'failed';
  aircraftId?: string;
  customerId?: string;
}

export const NotificationsManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('maintenance-reminder');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');

  const notificationTemplates = {
    'maintenance-reminder': {
      subject: 'Lembrete de Manutenção Programada',
      message: 'Olá {customerName}, sua aeronave {aircraftRegistration} possui uma manutenção programada para {maintenanceDate}. Entre em contato conosco para agendar o melhor horário.'
    },
    'component-expiry': {
      subject: 'Vencimento de Componente',
      message: 'Olá {customerName}, o componente {componentName} da aeronave {aircraftRegistration} vencerá em {expiryDate}. Recomendamos agendar a substituição.'
    },
    'inspection-due': {
      subject: 'Inspeção Obrigatória',
      message: 'Olá {customerName}, sua aeronave {aircraftRegistration} está próxima do limite de horas para inspeção obrigatória. Atual: {currentHours}h, Limite: {maxHours}h.'
    },
    'custom': {
      subject: 'Comunicado',
      message: ''
    }
  };

  const generateAutomaticNotifications = () => {
    const newNotifications: Notification[] = [];

    // Notificações de manutenção próxima
    mockMaintenances
      .filter(m => m.status === 'scheduled')
      .forEach(maintenance => {
        const aircraft = mockAircraft.find(a => a.id === maintenance.aircraftId);
        const customer = mockCustomers.find(c => c.aircraftIds.includes(maintenance.aircraftId));
        
        if (aircraft && customer) {
          const daysUntil = Math.ceil((new Date(maintenance.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntil <= 7 && daysUntil > 0) {
            newNotifications.push({
              id: `maint-${maintenance.id}`,
              type: 'email',
              recipient: customer.email,
              subject: 'Lembrete de Manutenção Programada',
              message: `Olá ${customer.name}, sua aeronave ${aircraft.registration} possui uma manutenção programada para ${format(new Date(maintenance.date), 'dd/MM/yyyy', { locale: ptBR })}. Entre em contato conosco para agendar o melhor horário.`,
              scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
              status: 'pending',
              aircraftId: aircraft.id,
              customerId: customer.id
            });
          }
        }
      });

    setNotifications(prev => [...prev, ...newNotifications]);
    alert(`${newNotifications.length} notificações automáticas foram geradas!`);
  };

  const sendNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'sent' as const }
        : n
    ));
    alert('Notificação enviada com sucesso!');
  };

  const sendBulkNotifications = () => {
    if (selectedRecipients.length === 0) {
      alert('Selecione pelo menos um destinatário.');
      return;
    }

    const template = notificationTemplates[selectedTemplate as keyof typeof notificationTemplates];
    const newNotifications: Notification[] = [];

    selectedRecipients.forEach(customerId => {
      const customer = mockCustomers.find(c => c.id === customerId);
      if (customer) {
        newNotifications.push({
          id: `bulk-${Date.now()}-${customerId}`,
          type: 'email',
          recipient: customer.email,
          subject: template.subject,
          message: selectedTemplate === 'custom' ? customMessage : template.message,
          scheduledDate: format(new Date(), 'yyyy-MM-dd'),
          status: 'sent',
          customerId: customer.id
        });
      }
    });

    setNotifications(prev => [...prev, ...newNotifications]);
    setSelectedRecipients([]);
    setCustomMessage('');
    alert(`${newNotifications.length} notificações enviadas!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central de Notificações</h1>
          <p className="text-gray-600">Comunicação automatizada com clientes</p>
        </div>
        <button
          onClick={generateAutomaticNotifications}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Bell className="h-5 w-5 mr-2" />
          Gerar Automáticas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.status === 'sent').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => n.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Falharam</p>
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.status === 'failed').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-blue-600">
                {notifications.length > 0 
                  ? Math.round((notifications.filter(n => n.status === 'sent').length / notifications.length) * 100)
                  : 0}%
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Envio em Massa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Enviar Notificação em Massa</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo de Mensagem
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="maintenance-reminder">Lembrete de Manutenção</option>
                <option value="component-expiry">Vencimento de Componente</option>
                <option value="inspection-due">Inspeção Obrigatória</option>
                <option value="custom">Mensagem Personalizada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatários
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {mockCustomers.map((customer) => (
                  <label key={customer.id} className="flex items-center space-x-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(customer.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecipients(prev => [...prev, customer.id]);
                        } else {
                          setSelectedRecipients(prev => prev.filter(id => id !== customer.id));
                        }
                      }}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prévia da Mensagem
              </label>
              {selectedTemplate === 'custom' ? (
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Digite sua mensagem personalizada..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <div className="h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg overflow-y-auto">
                  <p className="text-sm text-gray-700">
                    {notificationTemplates[selectedTemplate as keyof typeof notificationTemplates].message}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={sendBulkNotifications}
              disabled={selectedRecipients.length === 0}
              className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar para {selectedRecipients.length} destinatário(s)
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Histórico de Notificações</h2>
        
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const customer = mockCustomers.find(c => c.id === notification.customerId);
              const aircraft = mockAircraft.find(a => a.id === notification.aircraftId);
              
              return (
                <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(notification.status)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{notification.subject}</h4>
                        <p className="text-sm text-gray-600">Para: {notification.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                        {notification.status === 'sent' ? 'Enviada' : 
                         notification.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </span>
                      {notification.status === 'pending' && (
                        <button
                          onClick={() => sendNotification(notification.id)}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors duration-200"
                        >
                          Enviar
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                    {notification.message}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {customer && (
                        <span>Cliente: {customer.name}</span>
                      )}
                      {aircraft && (
                        <span>Aeronave: {aircraft.registration}</span>
                      )}
                    </div>
                    <span>
                      Agendada: {format(new Date(notification.scheduledDate), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação enviada</h3>
            <p className="text-gray-600">As notificações aparecerão aqui conforme forem enviadas</p>
          </div>
        )}
      </div>
    </div>
  );
};