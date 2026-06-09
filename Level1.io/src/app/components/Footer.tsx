import { Dices } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 mt-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dices className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary">Level1.io</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2025 Level1.io - Sua jornada no mundo dos RPGs começa aqui
          </p>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Sobre</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
