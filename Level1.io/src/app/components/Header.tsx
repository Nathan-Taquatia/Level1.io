import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dices, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { login2 } from "../service/usuario";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleQuickLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) return;
    setErro("");
    try {
      const dados = await login2(email, password);
      if (dados && dados.length > 0) {
        login(email, password, dados[0]);
        navigate('/dashboard');
      } else {
        setErro("Email ou senha incorretos.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickLogin();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Dices className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Level1.io</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5 text-primary" />
              <span>{user?.name}</span>
            </div>
            <Button 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1 mr-8">
            {erro && <p className="text-xs text-destructive">{erro}</p>}
            <div className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Email"
              className="w-40 bg-input-background border-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Input
              type="password"
              placeholder="Senha"
              className="w-40 bg-input-background border-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              className="bg-primary hover:bg-accent"
              onClick={handleQuickLogin}
            >
              Entrar
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate('/cadastro')}
            >
              Cadastrar-se
            </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}