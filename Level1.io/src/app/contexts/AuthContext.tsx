import { createContext, useContext, useState, ReactNode } from 'react';

// Dados do usuario autenticado
interface User {
  name: string;
  email: string;
  id_usuario?: number;
  characterName?: string;
  role?: 'player' | 'dm';
}

// Funcoes e estado expostos pelo contexto de autenticacao
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userData?: { nomeusuario: string; apelido: string; id_usuario: number }) => void;
  signup: (name: string, email: string, password: string, characterName?: string, id_usuario?: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor global de autenticacao — envolve toda a aplicacao
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Salva os dados do usuario no estado apos login bem-sucedido
  const login = (email: string, password: string, userData?: { nomeusuario: string; apelido: string; id_usuario: number }) => {
    setUser({
      name: userData?.nomeusuario ?? email,
      email: email,
      id_usuario: userData?.id_usuario,
      characterName: userData?.apelido ?? undefined,
    });
  };

  // Salva os dados do usuario no estado apos cadastro bem-sucedido
  const signup = (name: string, email: string, password: string, characterName?: string, id_usuario?: number) => {
    setUser({
      name,
      email,
      id_usuario,
      characterName,
    });
  };

  // Remove o usuario do estado, encerrando a sessao
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acessar o contexto de autenticacao em qualquer componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
