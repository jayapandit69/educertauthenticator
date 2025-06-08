import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  linkedinId?: string;
  role: 'institution' | 'student' | 'employer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loginWithLinkedIn: () => Promise<void>;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('educert_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('educert_user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('educert_user');
    toast.success('Logged out successfully');
  };

  const loginWithLinkedIn = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if LinkedIn SDK is loaded
      if (typeof window.IN === 'undefined') {
        toast.error('LinkedIn SDK not loaded. Please refresh the page.');
        reject(new Error('LinkedIn SDK not loaded'));
        return;
      }

      // Simulate LinkedIn OAuth flow
      // In a real implementation, you would use the actual LinkedIn API
      const mockLinkedInAuth = () => {
        // Simulate API call delay
        setTimeout(() => {
          const mockUserData: User = {
            id: `linkedin_${Date.now()}`,
            name: 'John Doe',
            email: 'john.doe@example.com',
            profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
            linkedinId: 'john-doe-123',
            role: 'student'
          };
          
          login(mockUserData);
          resolve();
        }, 1500);
      };

      toast.loading('Connecting to LinkedIn...', { duration: 1500 });
      mockLinkedInAuth();
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loginWithLinkedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};