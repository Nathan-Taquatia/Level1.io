import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface Group {
  id: string;
  name: string;
  game: string;
  description: string;
  players: string;
  location: string;
  schedule: string;
  openSlots: number;
}

const groups: Group[] = [
  {
    id: "1",
    name: "Corredores Sombrios",
    game: "Shadowrun",
    description: "Grupo experiente procurando mais um corredor para missões cyberpunk. Focamos em roleplay e histórias complexas no mundo das sombras.",
    players: "4/5 jogadores",
    location: "Online (Discord)",
    schedule: "Sábados, 20:00",
    openSlots: 1,
  },
  {
    id: "2",
    name: "California Dreamin",
    game: "Vampire: The Masquerade",
    description: "Mesa focada em intriga política e drama vampírico. Procuramos jogadores interessados em roleplay intenso e narrativa profunda.",
    players: "3/6 jogadores",
    location: "Online (Roll20)",
    schedule: "Sextas, 21:00",
    openSlots: 3,
  },
  {
    id: "3",
    name: "Aventureiros de Faerûn",
    game: "Dungeons & Dragons 5e",
    description: "Grupo iniciante e acolhedor jogando D&D 5e. Perfeito para quem está começando! Focamos em diversão e aprendizado conjunto.",
    players: "3/5 jogadores",
    location: "Presencial - São Paulo/SP",
    schedule: "Domingos, 15:00",
    openSlots: 2,
  },
];

export function Groups() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl text-foreground mb-4">
          Encontre um Grupo Acolhedor
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Conecte-se com outros jogadores e comece sua jornada no mundo dos TTRPGs
        </p>
      </div>

      {/* Groups List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {groups.map((group) => (
          <Card key={group.id} className="bg-card border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-foreground text-2xl mb-2">
                    {group.name}
                  </CardTitle>
                  <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {group.game}
                  </div>
                  <CardDescription className="text-base">
                    {group.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{group.players}</span>
                  <span className="text-xs bg-accent/50 px-2 py-0.5 rounded">
                    {group.openSlots} {group.openSlots === 1 ? 'vaga' : 'vagas'} disponível
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{group.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{group.location}</span>
                </div>
              </div>
              <Button className="w-full sm:w-auto bg-primary hover:bg-accent">
                Solicitar Participação
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link to="/" className="text-primary hover:text-accent inline-flex items-center gap-2">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}