import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getGruposUsuario, criarGrupo } from "../service/grupos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Users, Plus, Crown, UserPlus, Calendar } from "lucide-react";
import { Link } from "react-router";
import { UserNavigation } from "./UserNavigation";

// Estrutura de um grupo retornado pela API
interface GrupoAPI {
  idgrupos: number;
  gruponomes: string;
  descricao: string | null;
  role: 'mestre' | 'jogador';
}

export function MyGroups() {
  const { user, isAuthenticated } = useAuth();
  const [grupos, setGrupos] = useState<GrupoAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [managingGroupId, setManagingGroupId] = useState<number | null>(null);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [criando, setCriando] = useState(false);

  // Carrega os grupos do usuario ao montar o componente
  useEffect(() => {
    if (!user?.id_usuario) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    getGruposUsuario(user.id_usuario)
      .then(setGrupos)
      .catch(() => setErro("Erro ao carregar grupos."))
      .finally(() => setCarregando(false));
  }, [user?.id_usuario]);

  // Cria um novo grupo e vincula o usuario como mestre
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !user?.id_usuario) return;
    setCriando(true);
    try {
      await criarGrupo(newGroup.name, newGroup.description, user.id_usuario);
      const atualizados = await getGruposUsuario(user.id_usuario);
      setGrupos(atualizados);
      setNewGroup({ name: "", description: "" });
      setShowCreateForm(false);
    } catch {
      setErro("Erro ao criar grupo.");
    } finally {
      setCriando(false);
    }
  };

  const managingGroup = managingGroupId !== null ? grupos.find(g => g.idgrupos === managingGroupId) : null;

  return (
    <>
      <UserNavigation />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-foreground mb-2">Meus Grupos</h1>
            <p className="text-muted-foreground">Gerencie os grupos de RPG que você participa</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-primary hover:bg-accent">
              <Plus className="w-4 h-4 mr-2" />
              Criar Grupo
            </Button>
          )}
        </div>

        {erro && <p className="text-destructive text-sm mb-4">{erro}</p>}

        {/* Create Group Form */}
        {showCreateForm && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Criar Novo Grupo</CardTitle>
              <CardDescription>Preencha os dados do seu grupo de RPG</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Nome do Grupo</Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="bg-input-background border-input"
                    placeholder="Ex: Aventureiros de Faerûn"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="bg-input-background border-input min-h-[100px]"
                    placeholder="Descreva o estilo de jogo, frequência, expectativas..."
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary hover:bg-accent" disabled={criando}>
                    {criando ? "Criando..." : "Criar Grupo"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="border-border">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Groups List */}
        {carregando ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Carregando grupos...</p>
            </CardContent>
          </Card>
        ) : grupos.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Você ainda não faz parte de nenhum grupo.
                <br />
                Crie seu primeiro grupo ou encontre um para participar!
              </p>
              <Link to="/grupos">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Encontrar Grupos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {grupos.map((grupo) => (
              <Card key={grupo.idgrupos} className="bg-card border-border hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <CardTitle className="text-foreground text-xl">{grupo.gruponomes}</CardTitle>
                      </div>
                      {grupo.role === 'mestre' && (
                        <div className="inline-flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium mb-2">
                          <Crown className="w-3 h-3" />
                          Você é o Mestre
                        </div>
                      )}
                      <CardDescription className="text-sm">
                        {grupo.descricao ?? "Sem descrição."}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Ver campanhas do grupo</span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <Link to="/minhas-campanhas" className="flex-1">
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                          Ver Campanhas
                        </Button>
                      </Link>
                      {grupo.role === 'mestre' && (
                        <Button
                          variant="outline"
                          className="border-border"
                          onClick={() => setManagingGroupId(grupo.idgrupos)}
                        >
                          Gerenciar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Manage Group Modal */}
        {managingGroup && (
          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Gerenciar: {managingGroup.gruponomes}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setManagingGroupId(null)}>✕</Button>
              </div>
              <CardDescription>Informações do grupo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-foreground">Nome</Label>
                  <p className="text-muted-foreground">{managingGroup.gruponomes}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground">Descrição</Label>
                  <p className="text-muted-foreground">{managingGroup.descricao ?? "Sem descrição."}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Link to="/minhas-campanhas" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-accent">Gerenciar Campanhas</Button>
                  </Link>
                  <Button variant="outline" onClick={() => setManagingGroupId(null)} className="border-border">
                    Fechar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {grupos.length > 0 && (
          <Card className="bg-card/50 border-border mt-8">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">Procurando por mais aventuras?</p>
              <Link to="/grupos">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Encontrar Mais Grupos
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
