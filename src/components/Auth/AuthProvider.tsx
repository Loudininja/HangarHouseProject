import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mechanic' | 'manager' | 'customer';
  company: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    company: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('hangarhouse_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('hangarhouse_user');
      }
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar credenciais de demonstração
      if (credentials.email === 'admin@hangarhouse.com' && credentials.password === 'admin123') {
        const user: User = {
          id: '1',
          name: 'Administrador',
          email: 'admin@hangarhouse.com',
          role: 'admin',
          company: 'HangarHouse'
        };
        
        setUser(user);
        localStorage.setItem('hangarhouse_user', JSON.stringify(user));
      } else {
        throw new Error('Email ou senha incorretos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    company: string;
    role: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verificar se email já existe (simulação)
      if (userData.email === 'admin@hangarhouse.com') {
        throw new Error('Este email já está em uso');
      }

      const user: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role as User['role'],
        company: userData.company
      };
      
      setUser(user);
      localStorage.setItem('hangarhouse_user', JSON.stringify(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hangarhouse_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};