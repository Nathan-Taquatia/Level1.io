import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  characterName?: string;
  role?: 'player' | 'dm'; // For future use
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, characterName?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

 const login = (email: string, password: string, userData?: { nomeusuario: string; apelido: string }) => {
  setUser({
    name: userData?.nomeusuario ?? email,
    email: email,
    characterName: userData?.apelido ?? undefined,
  });
};

  const signup = (name: string, email: string, password: string, characterName?: string) => {
    // Mock signup - in production this would call an API
    setUser({
      name: name,
      email: email,
      characterName: characterName,
      role: 'player', // Default to player, can be changed later
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}