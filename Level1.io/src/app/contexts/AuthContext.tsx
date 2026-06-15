import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  id_usuario?: number;
  characterName?: string;
  role?: 'player' | 'dm';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userData?: { nomeusuario: string; apelido: string; id_usuario: number }) => void;
  signup: (name: string, email: string, password: string, characterName?: string, id_usuario?: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, userData?: { nomeusuario: string; apelido: string; id_usuario: number }) => {
    setUser({
      name: userData?.nomeusuario ?? email,
      email: email,
      id_usuario: userData?.id_usuario,
      characterName: userData?.apelido ?? undefined,
    });
  };

  const signup = (name: string, email: string, password: string, characterName?: string, id_usuario?: number) => {
    setUser({
      name,
      email,
      id_usuario,
      characterName,
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