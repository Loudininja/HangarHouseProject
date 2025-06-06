import React from 'react';
import { Plane, Settings, User, Bell, BarChart3, FileText, Mail, Globe } from 'lucide-react';

interface MobileNavProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onNavigate, currentSection }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'aircraft', label: 'Aeronaves', icon: Plane },
    { id: 'maintenance', label: 'Manutenção', icon: Settings },
    { id: 'customers', label: 'Clientes', icon: User },
    { id: 'directives', label: 'Diretrizes', icon: FileText },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'anac', label: 'ANAC', icon: Globe },
    { id: 'reports', label: 'Relatórios', icon: Mail }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 gap-1">
        {navigationItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-2 transition-colors duration-200 ${
                currentSection === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-1 border-t border-gray-100">
        {navigationItems.slice(4, 8).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-2 transition-colors duration-200 ${
                currentSection === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};