import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollText, FileText, Lightbulb } from "lucide-react";

const features = [
  {
    icon: ScrollText,
    title: "Fichas de Personagens",
    description: "Crie, edite e armazene fichas de personagens de diversos sistemas de RPG. Tudo organizado e sempre acessível.",
  },
  {
    icon: FileText,
    title: "Gerador de PDFs",
    description: "Ferramentas para mestres gerarem PDFs prontos para impressão: fichas de NPCs, mapas de encontros e muito mais.",
  },
  {
    icon: Lightbulb,
    title: "Dicas para Iniciantes",
    description: "Guias completos, tutoriais e dicas essenciais para quem está começando no mundo dos RPGs de mesa.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Tudo Que Você Precisa</h2>
          <p className="text-muted-foreground text-lg">
            Ferramentas essenciais para mestres e jogadores iniciantes
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
