import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dices } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Signup user
    signup(name, email, password, characterName || undefined);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <Dices className="w-12 h-12 text-primary" />
          <span className="text-4xl font-bold text-primary">Level1.io</span>
        </div>

        {/* Signup Form */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl text-foreground">Cadastrar-se</h1>
            <p className="text-muted-foreground">
              Crie sua conta para começar sua jornada
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                className="bg-input-background border-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-input-background border-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-input-background border-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-input-background border-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="characterName" className="text-foreground">
                Nome do Personagem <span className="text-muted-foreground text-sm">(opcional)</span>
              </Label>
              <Input
                id="characterName"
                type="text"
                placeholder="Nome do seu personagem favorito"
                className="bg-input-background border-input"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-accent">
              Criar Conta
            </Button>

            <div className="text-center">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link to="/login" className="text-primary hover:text-accent">
                Entre aqui
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}