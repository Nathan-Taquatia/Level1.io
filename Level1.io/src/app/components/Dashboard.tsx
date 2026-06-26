import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignContext";
import { useCharacterSheets } from "../contexts/CharacterSheetContext";
import { getSolicitacoesPendentes, responderSolicitacao } from "../service/solicitacoes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, FileText, Users, Lightbulb, Plus, Bell, Check, X } from "lucide-react";
import { Agenda } from "./Agenda";
import { Link } from "react-router";
import { UserNavigation } from "./UserNavigation";
import { useState, useEffect } from "react";

// Estrutura de uma solicitacao de entrada em campanha pendente
interface Solicitacao {
  idsolicitacao: number;
  nomeusuario: string;
  apelido: string | null;
  campanhanome: string;
  idcampanha: number;
  criado_em: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const { getUserGroups } = useCampaigns();
  const { getUserSheets } = useCharacterSheets();
  const userGroups = user ? getUserGroups(user.email) : [];
  const userSheets = user ? getUserSheets(user.email) : [];
  const totalCampaigns = userGroups.reduce((acc, group) => acc + group.campaigns.length, 0);

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [respondendo, setRespondendo] = useState<number | null>(null);

  // Busca solicitacoes pendentes para campanhas onde o usuario e mestre
  useEffect(() => {
    if (!user?.id_usuario) return;
    getSolicitacoesPendentes(user.id_usuario)
      .then(setSolicitacoes)
      .catch(() => {});
  }, [user?.id_usuario]);

  // Aceita ou nega uma solicitacao e remove da lista apos resposta
  const handleResponder = async (idsolicitacao: number, status: 'aceito' | 'negado') => {
    setRespondendo(idsolicitacao);
    try {
      await responderSolicitacao(idsolicitacao, status);
      setSolicitacoes(solicitacoes.filter(s => s.idsolicitacao !== idsolicitacao));
    } catch {
      // silencioso
    } finally {
      setRespondendo(null);
    }
  };

  return (
    <>
      <UserNavigation />
      <div className="container mx-auto px-4 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl text-foreground mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        {user?.characterName && (
          <p className="text-muted-foreground">
            Personagem: <span className="text-primary">{user.characterName}</span>
          </p>
        )}
      </div>

      {/* Notificações para mestres */}
      {solicitacoes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl text-foreground">Solicitações Pendentes</h2>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {solicitacoes.length}
            </span>
          </div>
          <div className="space-y-3">
            {solicitacoes.map((sol) => (
              <Card key={sol.idsolicitacao} className="bg-card border-border border-l-4 border-l-primary">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-foreground font-medium">
                      {sol.nomeusuario}{sol.apelido ? ` (${sol.apelido})` : ''} quer entrar em{' '}
                      <span className="text-primary">{sol.campanhanome}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(sol.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-accent"
                      disabled={respondendo === sol.idsolicitacao}
                      onClick={() => handleResponder(sol.idsolicitacao, 'aceito')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                      disabled={respondendo === sol.idsolicitacao}
                      onClick={() => handleResponder(sol.idsolicitacao, 'negado')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Negar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Agenda Section */}
      <div className="mb-12">
        <Agenda />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link to="/fichas">
          <Card className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Fichas de Personagem</CardTitle>
              <CardDescription>
                Gerencie suas fichas de personagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nova Ficha
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/minhas-campanhas">
          <Card className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Campanhas</CardTitle>
              <CardDescription>
                Veja e participe de campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Campanhas
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/campanhas">
          <Card className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Explorar Campanhas</CardTitle>
              <CardDescription>
                Encontre campanhas da comunidade para participar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Todas
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/meus-grupos">
          <Card className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Grupos</CardTitle>
              <CardDescription>
                Conecte-se com outros jogadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Grupos
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dicas">
          <Card className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Dicas</CardTitle>
              <CardDescription>
                Aprenda mais sobre TTRPG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Dicas
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Suas Fichas</CardTitle>
            <CardDescription>Fichas de personagem recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {userSheets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Você ainda não tem fichas de personagem.
                <br />
                Crie sua primeira ficha para começar!
              </div>
            ) : (
              <div className="space-y-3">
                {userSheets.slice(0, 3).map((sheet) => (
                  <div key={sheet.id} className="p-3 bg-card/50 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">{sheet.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {sheet.race} {sheet.class} • Nível {sheet.level} • {sheet.system}
                        </p>
                      </div>
                      {sheet.pdfFile && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          PDF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Link to="/fichas" className="text-primary hover:text-accent text-sm inline-flex items-center gap-1 mt-2">
                  Ver todas →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Campanhas Ativas</CardTitle>
            <CardDescription>Suas campanhas em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            {totalCampaigns === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Você não está participando de nenhuma campanha.
                <br />
                Participe ou crie uma nova campanha!
              </div>
            ) : (
              <div className="space-y-3">
                {userGroups.slice(0, 3).map((group) =>
                  group.campaigns.slice(0, 2).map((campaign) => (
                    <div key={campaign.id} className="p-3 bg-card/50 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground font-medium">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{group.name} • {campaign.rulesSystem}</p>
                        </div>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {campaign.type === "original" ? "Original" : "Oficial"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <Link to="/minhas-campanhas" className="text-primary hover:text-accent text-sm inline-flex items-center gap-1 mt-2">
                  Ver todas →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}