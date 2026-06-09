import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface GameSession {
  id: string;
  title: string;
  date: string;
  time: string;
  players: string;
  description?: string;
}

export function Agenda() {
  const [sessions, setSessions] = useState<GameSession[]>([
    {
      id: "1",
      title: "Campanha: A Mina Perdida de Phandelver",
      date: "2026-04-05",
      time: "19:00",
      players: "4 jogadores",
      description: "Continuação da aventura na mina abandonada"
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newSession, setNewSession] = useState<Partial<GameSession>>({
    title: "",
    date: "",
    time: "",
    players: "",
    description: "",
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    const session: GameSession = {
      id: Date.now().toString(),
      title: newSession.title || "",
      date: newSession.date || "",
      time: newSession.time || "",
      players: newSession.players || "",
      description: newSession.description,
    };

    setSessions([...sessions, session]);
    setNewSession({
      title: "",
      date: "",
      time: "",
      players: "",
      description: "",
    });
    setIsOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Agenda de Jogos
            </CardTitle>
            <CardDescription>Seus próximos jogos de RPG agendados</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-accent">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Agendar Nova Sessão</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da sua próxima sessão de RPG
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Título da Sessão</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Campanha de D&D - Sessão 5"
                    className="bg-input-background border-input"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      className="bg-input-background border-input"
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-foreground">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      className="bg-input-background border-input"
                      value={newSession.time}
                      onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="players" className="text-foreground">Jogadores</Label>
                  <Input
                    id="players"
                    placeholder="Ex: 4 jogadores"
                    className="bg-input-background border-input"
                    value={newSession.players}
                    onChange={(e) => setNewSession({ ...newSession, players: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Descrição <span className="text-muted-foreground text-sm">(opcional)</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Notas sobre a sessão..."
                    className="bg-input-background border-input"
                    value={newSession.description}
                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-accent">
                  Agendar Sessão
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma sessão agendada.
            <br />
            Clique em "Novo Agendamento" para adicionar sua primeira sessão!
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-foreground font-medium mb-2">
                      {session.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{session.players}</span>
                      </div>
                      {session.description && (
                        <p className="mt-2 text-foreground/80">{session.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
