import React from 'react';
import { Plane, Bell, User, Settings, FileText, Mail, Globe } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Plane },
    { id: 'aircraft', label: 'Aeronaves', icon: Plane },
    { id: 'maintenance', label: 'Manutenção', icon: Settings },
    { id: 'customers', label: 'Clientes', icon: User },
    { id: 'directives', label: 'Diretrizes', icon: FileText },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'anac', label: 'ANAC', icon: Globe },
    { id: 'reports', label: 'Relatórios', icon: Mail }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HangarHouse</h1>
                <p className="text-xs text-gray-500">Sistema de Manutenção</p>
              </div>
            </div>
            
            <nav className="hidden lg:flex space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      currentSection === item.id
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};