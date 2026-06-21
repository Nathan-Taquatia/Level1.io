import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getGruposUsuario } from "../service/grupos";
import { getCampanhasGrupo, getCampanhasUsuario, criarCampanha } from "../service/campanhas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, BookOpen, Users } from "lucide-react";
import { UserNavigation } from "./UserNavigation";

interface GrupoAPI {
  idgrupos: number;
  gruponomes: string;
  descricao: string | null;
  role: 'mestre' | 'jogador';
}

interface CampanhaAPI {
  idcampanha: number;
  campanhanome: string;
  datajogo: string | null;
  descricao: string | null;
  tipo: 'original' | 'oficial';
  dm_idusuario: number | null;
  nomesistema: string | null;
}

interface GrupoComCampanhas extends GrupoAPI {
  campanhas: CampanhaAPI[];
}

export function MyCampaigns() {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState<GrupoComCampanhas[]>([]);
  const [campanhasJogador, setCampanhasJogador] = useState<CampanhaAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [criando, setCriando] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    campanhanome: "",
    tipo: "original" as "original" | "oficial",
    descricao: "",
    datajogo: "",
    grupos_idgrupos: "",
  });

  async function carregar() {
    if (!user?.id_usuario) return;
    try {
      const [gruposData, campJogador] = await Promise.all([
        getGruposUsuario(user.id_usuario),
        getCampanhasUsuario(user.id_usuario),
      ]);
      const gruposComCampanhas = await Promise.all(
        gruposData.map(async (grupo: GrupoAPI) => {
          const campanhas = await getCampanhasGrupo(grupo.idgrupos);
          return { ...grupo, campanhas };
        })
      );
      setGrupos(gruposComCampanhas);
      setCampanhasJogador(campJogador);
    } catch {
      setErro("Erro ao carregar campanhas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    setCarregando(true);
    carregar();
  }, [user?.id_usuario]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.campanhanome || !newCampaign.grupos_idgrupos) return;
    setCriando(true);
    try {
      await criarCampanha({
        campanhanome: newCampaign.campanhanome,
        tipo: newCampaign.tipo,
        descricao: newCampaign.descricao || undefined,
        datajogo: newCampaign.datajogo || undefined,
        grupos_idgrupos: Number(newCampaign.grupos_idgrupos),
        dm_idusuario: user?.id_usuario,
      });
      setNewCampaign({ campanhanome: "", tipo: "original", descricao: "", datajogo: "", grupos_idgrupos: "" });
      setShowCreateForm(false);
      await carregar();
    } catch {
      setErro("Erro ao criar campanha.");
    } finally {
      setCriando(false);
    }
  };

  const totalCampanhas = grupos.reduce((acc, g) => acc + g.campanhas.length, 0);

  return (
    <>
      <UserNavigation />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-foreground mb-2">Minhas Campanhas</h1>
            <p className="text-muted-foreground">Gerencie e participe de campanhas dos seus grupos</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-primary hover:bg-accent">
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

        {erro && <p className="text-destructive text-sm mb-4">{erro}</p>}

        {/* Create Campaign Form */}
        {showCreateForm && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Criar Nova Campanha</CardTitle>
              <CardDescription>Preencha os dados da nova campanha</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Grupo</Label>
                  <Select value={newCampaign.grupos_idgrupos} onValueChange={(v) => setNewCampaign({ ...newCampaign, grupos_idgrupos: v })}>
                    <SelectTrigger className="bg-input-background border-input">
                      <SelectValue placeholder="Selecione um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.idgrupos} value={String(grupo.idgrupos)}>
                          {grupo.gruponomes}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Nome da Campanha</Label>
                  <Input
                    value={newCampaign.campanhanome}
                    onChange={(e) => setNewCampaign({ ...newCampaign, campanhanome: e.target.value })}
                    className="bg-input-background border-input"
                    placeholder="Ex: A Queda de Waterdeep"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Tipo</Label>
                  <Select value={newCampaign.tipo} onValueChange={(v: "original" | "oficial") => setNewCampaign({ ...newCampaign, tipo: v })}>
                    <SelectTrigger className="bg-input-background border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="oficial">Oficial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Data da Sessão <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                  <Input
                    type="date"
                    value={newCampaign.datajogo}
                    onChange={(e) => setNewCampaign({ ...newCampaign, datajogo: e.target.value })}
                    className="bg-input-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Descrição <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                  <Textarea
                    value={newCampaign.descricao}
                    onChange={(e) => setNewCampaign({ ...newCampaign, descricao: e.target.value })}
                    className="bg-input-background border-input min-h-[100px]"
                    placeholder="Descreva a história e contexto da campanha..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary hover:bg-accent" disabled={criando}>
                    {criando ? "Criando..." : "Criar Campanha"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="border-border">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Campaigns by Group */}
        {carregando ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Carregando campanhas...</p>
            </CardContent>
          </Card>
        ) : grupos.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Você ainda não faz parte de nenhum grupo.
                <br />
                Entre em um grupo para participar de campanhas!
              </p>
            </CardContent>
          </Card>
        ) : totalCampanhas === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum dos seus grupos tem campanhas ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {grupos.map((grupo) => (
              grupo.campanhas.length > 0 && (
                <div key={grupo.idgrupos}>
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-primary" />
                    <div>
                      <h2 className="text-2xl text-foreground">{grupo.gruponomes}</h2>
                      {grupo.descricao && (
                        <p className="text-sm text-muted-foreground">{grupo.descricao}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grupo.campanhas.map((campanha) => (
                      <Card key={`grupo-${grupo.idgrupos}-camp-${campanha.idcampanha}`} className="bg-card border-border hover:border-primary transition-colors">
                        <CardHeader>
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-foreground">{campanha.campanhanome}</CardTitle>
                          <CardDescription>
                            <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs mr-2">
                              {campanha.tipo === "original" ? "Original" : "Oficial"}
                            </span>
                            {campanha.nomesistema && (
                              <span className="text-muted-foreground">{campanha.nomesistema}</span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm">
                            {campanha.descricao ?? "Sem descrição."}
                          </p>
                          {campanha.datajogo && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-xs text-muted-foreground">
                                Data: {new Date(campanha.datajogo).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        {/* Campanhas como jogador aceito */}
        {campanhasJogador.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl text-foreground">Campanhas que Participo</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campanhasJogador.map((campanha) => (
                <Card key={`jogador-${campanha.idcampanha}`} className="bg-card border-border hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-foreground">{campanha.campanhanome}</CardTitle>
                    <CardDescription>
                      <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs mr-2">
                        {campanha.tipo === 'original' ? 'Original' : 'Oficial'}
                      </span>
                      {campanha.nomesistema && (
                        <span className="text-muted-foreground">{campanha.nomesistema}</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {campanha.descricao ?? "Sem descrição."}
                    </p>
                    {campanha.datajogo && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Data: {new Date(campanha.datajogo).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
