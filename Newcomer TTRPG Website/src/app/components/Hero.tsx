import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
      
      <div className="container mx-auto relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary">Bem-vindo ao mundo dos TTRPGs</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Comece Sua Jornada Épica
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Level1.io é a plataforma completa para iniciantes em RPG de mesa. 
          Gerencie fichas de personagens, crie PDFs para mestres e aprenda tudo 
          sobre o hobby mais criativo do mundo.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="bg-primary hover:bg-accent">
            Criar Minha Primeira Ficha
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Ver Guia para Iniciantes
          </Button>
        </div>
      </div>
    </section>
  );
}
