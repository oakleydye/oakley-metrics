'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  auth0Id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT' | 'VIEWER';
  organizationId?: string;
  organization?: any;
  websites: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: 'ADMIN' | 'CLIENT' | 'VIEWER') => boolean;
  canAccessWebsite: (websiteId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = () => {
    window.location.href = '/api/auth/login';
  };

  const logout = async () => {
    try {
      // Redirect to our logout endpoint which will handle Auth0 logout
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAuthenticated = !!user;

  const hasRole = (role: 'ADMIN' | 'CLIENT' | 'VIEWER') => {
    if (!user) return false;
    
    // Role hierarchy: ADMIN > CLIENT > VIEWER
    const roleHierarchy = { ADMIN: 3, CLIENT: 2, VIEWER: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[role];
  };

  const canAccessWebsite = (websiteId: string) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return user.websites.some(website => website.id === websiteId);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    canAccessWebsite,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends {}>(
  Component: React.ComponentType<P>,
  requiredRole?: 'ADMIN' | 'CLIENT' | 'VIEWER'
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="mb-4">Please log in to access this page.</p>
            <button
              onClick={() => window.location.href = '/api/auth/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Log In
            </button>
          </div>
        </div>
      );
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
