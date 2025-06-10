import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { MobileNav } from './components/Layout/MobileNav';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AircraftManagement } from './components/Aircraft/AircraftManagement';
import { AircraftForm } from './components/Aircraft/AircraftForm';
import { MaintenanceManagement } from './components/Maintenance/MaintenanceManagement';
import { MaintenanceForm } from './components/Maintenance/MaintenanceForm';
import { CustomerManagement } from './components/Customers/CustomerManagement';
import { CustomerForm } from './components/Customers/CustomerForm';
import { ReportsManagement } from './components/Reports/ReportsManagement';
import { DirectivesManagement } from './components/Directives/DirectivesManagement';
import { NotificationsManagement } from './components/Notifications/NotificationsManagement';
import { ANACIntegration } from './components/ANAC/ANACIntegration';
import { UserProfile } from './components/Profile/UserProfile';
import { Settings } from './components/Settings/Settings';
import { Aircraft, Customer, Maintenance } from './types';

const AppContent: React.FC = () => {
  const { user, login, register, logout, loading, error } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  
  // Estados para controlar formulários
  const [showAircraftForm, setShowAircraftForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials);
    } catch (error) {
      // Error is handled by AuthProvider
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    password: string;
    company: string;
    role: string;
  }) => {
    try {
      await register(userData);
    } catch (error) {
      // Error is handled by AuthProvider
    }
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    // Fechar todos os formulários ao navegar
    setShowAircraftForm(false);
    setShowMaintenanceForm(false);
    setShowCustomerForm(false);
  };

  // Handlers para ações rápidas
  const handleOpenAircraftForm = () => {
    setCurrentSection('aircraft');
    setShowAircraftForm(true);
  };

  const handleOpenMaintenanceForm = () => {
    setCurrentSection('maintenance');
    setShowMaintenanceForm(true);
  };

  const handleOpenCustomerForm = () => {
    setCurrentSection('customers');
    setShowCustomerForm(true);
  };

  const handleOpenReports = () => {
    setCurrentSection('reports');
  };

  // Handlers para salvar dados dos formulários
  const handleSaveAircraft = (aircraft: Aircraft | Omit<Aircraft, 'id'>) => {
    // Lógica para salvar aeronave seria implementada aqui
    console.log('Salvando aeronave:', aircraft);
    setShowAircraftForm(false);
  };

  const handleSaveMaintenance = (maintenance: Maintenance | Omit<Maintenance, 'id'>) => {
    // Lógica para salvar manutenção seria implementada aqui
    console.log('Salvando manutenção:', maintenance);
    setShowMaintenanceForm(false);
  };

  const handleSaveCustomer = (customer: Customer | Omit<Customer, 'id'>) => {
    // Lógica para salvar cliente seria implementada aqui
    console.log('Salvando cliente:', customer);
    setShowCustomerForm(false);
  };

  if (!user) {
    return showRegister ? (
      <RegisterForm
        onRegister={handleRegister}
        onToggleLogin={() => setShowRegister(false)}
        loading={loading}
        error={error}
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        onToggleRegister={() => setShowRegister(true)}
        loading={loading}
        error={error}
      />
    );
  }

  const renderSection = () => {
    // Verificar se algum formulário está aberto
    if (showAircraftForm) {
      return (
        <AircraftForm
          onSave={handleSaveAircraft}
          onCancel={() => setShowAircraftForm(false)}
        />
      );
    }

    if (showMaintenanceForm) {
      return (
        <MaintenanceForm
          onSave={handleSaveMaintenance}
          onCancel={() => setShowMaintenanceForm(false)}
        />
      );
    }

    if (showCustomerForm) {
      return (
        <CustomerForm
          onSave={handleSaveCustomer}
          onCancel={() => setShowCustomerForm(false)}
        />
      );
    }

    // Renderizar seções normais
    switch (currentSection) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onOpenAircraftForm={handleOpenAircraftForm}
            onOpenMaintenanceForm={handleOpenMaintenanceForm}
            onOpenCustomerForm={handleOpenCustomerForm}
            onOpenReports={handleOpenReports}
          />
        );
      case 'aircraft':
        return <AircraftManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'directives':
        return <DirectivesManagement />;
      case 'notifications':
        return <NotificationsManagement />;
      case 'anac':
        return <ANACIntegration />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onOpenAircraftForm={handleOpenAircraftForm}
            onOpenMaintenanceForm={handleOpenMaintenanceForm}
            onOpenCustomerForm={handleOpenCustomerForm}
            onOpenReports={handleOpenReports}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNavigate={handleNavigate} 
        currentSection={currentSection}
        user={user}
        onLogout={logout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {renderSection()}
      </main>

      <MobileNav onNavigate={handleNavigate} currentSection={currentSection} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;