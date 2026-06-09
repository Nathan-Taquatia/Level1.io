import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Calendar, Users, ArrowRight, Sword } from "lucide-react";
import { Link } from "react-router";

interface Campaign {
  id: string;
  name: string;
  game: string;
  description: string;
  difficulty: string;
  duration: string;
  players: string;
  type: string;
}

const campaigns: Campaign[] = [
  {
    id: "the-haunting",
    name: "The Haunting",
    game: "Call of Cthulhu",
    description: "Uma aventura introdutória clássica de Call of Cthulhu. Os investigadores são contratados para investigar uma mansão aparentemente assombrada em Boston. O que começa como uma simples investigação paranormal rapidamente se transforma em um confronto com horrores além da compreensão humana. Perfeita para iniciantes no sistema CoC, esta aventura gratuita combina investigação, terror psicológico e a icônica mecânica de sanidade. Ideal para uma sessão única ou como introdução a uma campanha maior.",
    difficulty: "Iniciante",
    duration: "1-2 sessões",
    players: "2-5 jogadores",
    type: "Aventura Grátis",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "iniciante":
      return "bg-green-500/20 text-green-400";
    case "intermediário":
      return "bg-yellow-500/20 text-yellow-400";
    case "avançado":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-primary/20 text-primary";
  }
};

export function Campaigns() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-primary" />
          <h1 className="text-4xl text-foreground">
            Aventuras Gratuitas
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aventuras prontas para jogar e começar sua jornada no mundo dos TTRPGs
        </p>
      </div>

      {/* Campaigns List */}
      <div className="max-w-5xl mx-auto space-y-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="bg-card border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-foreground text-2xl">
                      {campaign.name}
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {campaign.game}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(campaign.difficulty)}`}>
                      {campaign.difficulty}
                    </div>
                    <div className="inline-block bg-accent/30 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {campaign.type}
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {campaign.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{campaign.players}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{campaign.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Material incluído</span>
                </div>
              </div>
              <Button className="w-full sm:w-auto bg-primary hover:bg-accent">
                Ver Detalhes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Card className="bg-card/50 border-border max-w-2xl mx-auto">
          <CardContent className="py-8">
            <p className="text-muted-foreground mb-4">
              Pronto para começar sua aventura de terror?
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/grupos">
                <Button className="bg-primary hover:bg-accent">
                  <Users className="w-4 h-4 mr-2" />
                  Encontrar um Grupo
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Criar Conta Grátis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link to="/" className="text-primary hover:text-accent inline-flex items-center gap-2">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
