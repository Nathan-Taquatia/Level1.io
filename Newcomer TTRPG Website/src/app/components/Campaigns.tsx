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
    id: "1",
    name: "A Mina Perdida de Phandelver",
    game: "Dungeons & Dragons 5e",
    description: "Campanha introdutória perfeita para iniciantes. Explore masmorras, enfrente goblinoides e descubra os segredos de uma mina perdida há muito tempo.",
    difficulty: "Iniciante",
    duration: "10-15 sessões",
    players: "3-5 jogadores",
    type: "Aventura oficial",
  },
  {
    id: "2",
    name: "A Queda da Casa Usher",
    game: "Call of Cthulhu",
    description: "Investigação de horror gótico baseada no conto de Edgar Allan Poe. Desvende mistérios sombrios enquanto a sanidade dos investigadores é testada.",
    difficulty: "Intermediário",
    duration: "3-5 sessões",
    players: "2-4 jogadores",
    type: "Campanha de terror",
  },
  {
    id: "3",
    name: "Alimentando a Vingança",
    game: "Shadowrun 6e",
    description: "Uma missão cyberpunk clássica. Infiltre corporações, hackeie sistemas e sobreviva nas ruas perigosas de Seattle em 2080.",
    difficulty: "Avançado",
    duration: "6-8 sessões",
    players: "3-5 jogadores",
    type: "Aventura corporativa",
  },
  {
    id: "4",
    name: "A Última Esperança",
    game: "Vampire: The Masquerade",
    description: "Navegue pela política vampírica de uma cidade à beira da guerra entre facções. Intriga, traição e sedução aguardam os Membros.",
    difficulty: "Intermediário",
    duration: "12-20 sessões",
    players: "3-6 jogadores",
    type: "Crônica política",
  },
  {
    id: "5",
    name: "As Tumbas de Atuan",
    game: "Pathfinder 2e",
    description: "Explore tumbas antigas repletas de armadilhas mortais e tesouros esquecidos. Uma aventura épica de fantasia no mundo de Golarion.",
    difficulty: "Intermediário",
    duration: "8-12 sessões",
    players: "4-6 jogadores",
    type: "Dungeon Crawl",
  },
  {
    id: "6",
    name: "Guerras do Clone - Frente de Batalha",
    game: "Star Wars RPG",
    description: "Lidere tropas clone durante as Guerras do Clone. Batalhas épicas, dilemas morais e a sombra do lado sombrio da Força.",
    difficulty: "Iniciante",
    duration: "6-10 sessões",
    players: "3-5 jogadores",
    type: "Aventura espacial",
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
          <Sword className="w-10 h-10 text-primary" />
          <h1 className="text-4xl text-foreground">
            Campanhas Oficiais
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Descubra aventuras prontas para jogar, desde masmorras clássicas até intrigas políticas
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

      {/* Back to Dashboard */}
      <div className="text-center mt-12">
        <Link to="/dashboard" className="text-primary hover:text-accent inline-flex items-center gap-2">
          Voltar para o dashboard
        </Link>
      </div>
    </div>
  );
}
