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
  {
    id: "the-lightless-beacon",
    name: "The Lightless Beacon",
    game: "Call of Cthulhu",
    description: "Após um acidente marítimo, os investigadores ficam presos em uma pequena ilha costeira onde um farol misteriosamente deixou de funcionar. Enquanto procuram abrigo e tentam descobrir o que aconteceu aos responsáveis pelo local, percebem que algo estranho está espreitando na escuridão. Isolados do continente e cercados pelo mar, eles precisarão desvendar o mistério da ilha antes que seja tarde demais.",
    difficulty: "Iniciante",
    duration: "1-2 sessões",
    players: "2-5 jogadores",
    type: "Aventura Grátis",
  },
  {
    id: "chase",
    name: "Chase",
    game: "Overarms",
    description: "Japão, início dos anos 90. Na pequena cidade costeira de Makubetsu, os dias passam devagar. Para os jovens que ficaram, o tédio é constante — e encontrar problemas se tornou a melhor forma de se sentir vivo. Mas algo estranho está acontecendo: criaturas monstruosas vagando pelas ruas durante a noite, perseguindo pessoas e desaparecendo sem deixar rastros. Vocês são estudantes problemáticos que, quando os relatos sobre os monstros começam a se acumular, a curiosidade fala mais alto. Investigando os segredos de Makubetsu — de suas florestas silenciosas aos túneis abandonados, dos corredores da escola às ruas sinuosas da cidade — vocês descobrirão que há muito mais por trás dessas aparições. E, ao encarar a verdade, algo adormecido dentro de vocês também despertará.",
    difficulty: "Intermediário",
    duration: "3-5 sessões",
    players: "3-5 jogadores",
    type: "Aventura Grátis",
  },
  {
    id: "peril-in-pinebrook",
    name: "Peril in Pinebrook",
    game: "D&D 5e",
    description: "A pacata vila de Pinebrook vive dias de preocupação. Moradores desapareceram, estranhos acontecimentos vêm sendo relatados nos arredores e uma ameaça desconhecida parece se esconder nas florestas próximas. Atendendo ao pedido de ajuda da comunidade, os aventureiros partem para investigar o que está acontecendo. O que começa como uma missão simples logo se transforma em uma jornada repleta de perigos, exploração e combates, onde coragem e trabalho em equipe serão essenciais para proteger a vila.",
    difficulty: "Iniciante",
    duration: "2-3 sessões",
    players: "3-5 jogadores",
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
