import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { MobileNav } from './components/Layout/MobileNav';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AircraftManagement } from './components/Aircraft/AircraftManagement';
import { MaintenanceManagement } from './components/Maintenance/MaintenanceManagement';
import { CustomerManagement } from './components/Customers/CustomerManagement';
import { ReportsManagement } from './components/Reports/ReportsManagement';
import { DirectivesManagement } from './components/Directives/DirectivesManagement';
import { NotificationsManagement } from './components/Notifications/NotificationsManagement';
import { ANACIntegration } from './components/ANAC/ANACIntegration';

const AppContent: React.FC = () => {
  const { user, login, register, logout, loading, error } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

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
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNavigate={setCurrentSection} 
        currentSection={currentSection}
        user={user}
        onLogout={logout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {renderSection()}
      </main>

      <MobileNav onNavigate={setCurrentSection} currentSection={currentSection} />
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