import React, { useState } from 'react';
import { Plane, Bell, User, Settings, FileText, Mail, Globe, LogOut, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mechanic' | 'manager' | 'customer';
  company: string;
}

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'mechanic':
        return 'Mecânico';
      case 'manager':
        return 'Gerente Técnico';
      case 'customer':
        return 'Cliente';
      default:
        return role;
    }
  };

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
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{getRoleText(user.role)}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.company}</p>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Meu Perfil
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('settings');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Configurações
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};