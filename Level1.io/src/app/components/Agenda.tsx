import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getSessoesUsuario, criarSessao, deletarSessao } from "../service/sessoes";
import { getGruposUsuario } from "../service/grupos";
import { getCampanhasGrupo } from "../service/campanhas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SessaoAPI {
  idsessao: number;
  titulo: string;
  data_jogo: string;
  horario: string;
  descricao: string | null;
  idcampanha: number | null;
  idgrupo: number | null;
  campanhanome: string | null;
  gruponomes: string | null;
}

interface CampanhaOpcao {
  idcampanha: number;
  campanhanome: string;
}

export function Agenda() {
  const { user } = useAuth();
  const [sessoes, setSessoes] = useState<SessaoAPI[]>([]);
  const [campanhas, setCampanhas] = useState<CampanhaOpcao[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [newSession, setNewSession] = useState({
    titulo: "",
    data_jogo: "",
    horario: "",
    descricao: "",
    idcampanha: "",
  });

  // Busca as sessoes agendadas pelo usuario no banco
  async function carregarSessoes() {
    if (!user?.id_usuario) return;
    try {
      const dados = await getSessoesUsuario(user.id_usuario);
      setSessoes(dados);
    } catch {
      // silencioso — agenda e secundaria
    }
  }

  // Busca campanhas do usuario para popular o dropdown do formulario
  async function carregarCampanhas() {
    if (!user?.id_usuario) return;
    try {
      const grupos = await getGruposUsuario(user.id_usuario);
      const todas: CampanhaOpcao[] = [];
      for (const grupo of grupos) {
        const camps = await getCampanhasGrupo(grupo.idgrupos);
        camps.forEach((c: CampanhaOpcao) => todas.push(c));
      }
      setCampanhas(todas);
    } catch {
      // campanhas sao opcionais
    }
  }

  // Carrega sessoes e campanhas ao montar o componente
  useEffect(() => {
    carregarSessoes();
    carregarCampanhas();
  }, [user?.id_usuario]);

  // Salva uma nova sessao no banco e atualiza a lista
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id_usuario) return;
    setSalvando(true);
    try {
      await criarSessao({
        titulo: newSession.titulo,
        data_jogo: newSession.data_jogo,
        horario: newSession.horario,
        descricao: newSession.descricao || undefined,
        idcampanha: newSession.idcampanha ? Number(newSession.idcampanha) : undefined,
        criado_por: user.id_usuario,
      });
      setNewSession({ titulo: "", data_jogo: "", horario: "", descricao: "", idcampanha: "" });
      setIsOpen(false);
      await carregarSessoes();
    } catch {
      // erro silencioso por ora
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async (idsessao: number) => {
    try {
      await deletarSessao(idsessao);
      setSessoes(sessoes.filter(s => s.idsessao !== idsessao));
    } catch {
      // erro silencioso por ora
    }
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
                <DialogDescription>Preencha os detalhes da sua próxima sessão de RPG</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSession} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Título da Sessão</Label>
                  <Input
                    placeholder="Ex: Campanha de D&D - Sessão 5"
                    className="bg-input-background border-input"
                    value={newSession.titulo}
                    onChange={(e) => setNewSession({ ...newSession, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Data</Label>
                    <Input
                      type="date"
                      className="bg-input-background border-input"
                      value={newSession.data_jogo}
                      onChange={(e) => setNewSession({ ...newSession, data_jogo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Horário</Label>
                    <Input
                      type="time"
                      className="bg-input-background border-input"
                      value={newSession.horario}
                      onChange={(e) => setNewSession({ ...newSession, horario: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Campanha <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                  <Select value={newSession.idcampanha} onValueChange={(v) => setNewSession({ ...newSession, idcampanha: v })}>
                    <SelectTrigger className="bg-input-background border-input">
                      <SelectValue placeholder="Vincular a uma campanha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {campanhas.map((c) => (
                        <SelectItem key={c.idcampanha} value={String(c.idcampanha)}>
                          {c.campanhanome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Descrição <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                  <Input
                    placeholder="Notas sobre a sessão..."
                    className="bg-input-background border-input"
                    value={newSession.descricao}
                    onChange={(e) => setNewSession({ ...newSession, descricao: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-accent" disabled={salvando}>
                  {salvando ? "Salvando..." : "Agendar Sessão"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sessoes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma sessão agendada.
            <br />
            Clique em "Novo Agendamento" para adicionar sua primeira sessão!
          </div>
        ) : (
          <div className="space-y-3">
            {sessoes.map((sessao) => (
              <div
                key={sessao.idsessao}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-foreground font-medium mb-2">{sessao.titulo}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(sessao.data_jogo)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{sessao.horario.slice(0, 5)}</span>
                      </div>
                      {sessao.campanhanome && (
                        <p className="text-xs text-primary/80">Campanha: {sessao.campanhanome}</p>
                      )}
                      {sessao.descricao && (
                        <p className="mt-2 text-foreground/80">{sessao.descricao}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(sessao.idsessao)}
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
