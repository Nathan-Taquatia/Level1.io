import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { criarSolicitacao } from "../service/solicitacoes";
import { getCampanhasUsuario } from "../service/campanhas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Calendar, Users, Sword, LogIn } from "lucide-react";
import { Link } from "react-router";
import { UserNavigation } from "./UserNavigation";

interface CampanhaPublica {
  idcampanha: number;
  campanhanome: string;
  datajogo: string | null;
  descricao: string | null;
  tipo: 'original' | 'oficial';
  dm_idusuario: number | null;
  nomesistema: string | null;
  gruponomes: string | null;
  dm_nome: string | null;
}

export function PublicCampaigns() {
  const { user, isAuthenticated } = useAuth();
  const [campanhas, setCampanhas] = useState<CampanhaPublica[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState<number | null>(null);
  const [enviados, setEnviados] = useState<number[]>([]);
  const [participando, setParticipando] = useState<number[]>([]);

  useEffect(() => {
    fetch('https://level1-io-service.onrender.com/campanha')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setCampanhas)
      .catch(() => setErro("Erro ao carregar campanhas."))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (!user?.id_usuario) return;
    getCampanhasUsuario(user.id_usuario)
      .then((dados) => setParticipando(dados.map((c: { idcampanha: number }) => c.idcampanha)))
      .catch(() => {});
  }, [user?.id_usuario]);

  const handlePedirEntrar = async (idcampanha: number) => {
    if (!user?.id_usuario) return;
    setEnviando(idcampanha);
    try {
      await criarSolicitacao(user.id_usuario, idcampanha);
      setEnviados([...enviados, idcampanha]);
    } catch {
      setErro("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setEnviando(null);
    }
  };

  const isProprioMestre = (campanha: CampanhaPublica) =>
    user?.id_usuario === campanha.dm_idusuario;

  return (
    <>
      <UserNavigation />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sword className="w-10 h-10 text-primary" />
            <h1 className="text-4xl text-foreground">Campanhas</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore campanhas criadas pela comunidade e encontre sua próxima aventura
          </p>
        </div>

        {erro && <p className="text-destructive text-center mb-4">{erro}</p>}

        {carregando ? (
          <p className="text-center text-muted-foreground">Carregando campanhas...</p>
        ) : campanhas.length === 0 ? (
          <Card className="bg-card border-border max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma campanha disponível ainda.
                <br />
                Crie a primeira!
              </p>
              <Link to="/minhas-campanhas">
                <Button className="bg-primary hover:bg-accent">Criar Campanha</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {campanhas.map((campanha) => (
              <Card key={campanha.idcampanha} className="bg-card border-border hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-foreground text-2xl">
                          {campanha.campanhanome}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {campanha.nomesistema && (
                          <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {campanha.nomesistema}
                          </div>
                        )}
                        <div className="inline-block bg-accent/30 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {campanha.tipo === 'original' ? 'Original' : 'Oficial'}
                        </div>
                        {campanha.gruponomes && (
                          <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                            {campanha.gruponomes}
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {campanha.descricao ?? "Sem descrição."}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6 mb-4 text-sm">
                    {campanha.dm_nome && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Mestre: {campanha.dm_nome}</span>
                      </div>
                    )}
                    {campanha.datajogo && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(campanha.datajogo).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>

                  {!isAuthenticated ? (
                    <Link to="/login">
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <LogIn className="w-4 h-4 mr-2" />
                        Entre para participar
                      </Button>
                    </Link>
                  ) : isProprioMestre(campanha) ? (
                    <Button disabled variant="outline" className="border-border text-muted-foreground">
                      Você é o mestre desta campanha
                    </Button>
                  ) : participando.includes(campanha.idcampanha) ? (
                    <Button disabled variant="outline" className="border-border text-muted-foreground">
                      Você já faz parte desta campanha
                    </Button>
                  ) : enviados.includes(campanha.idcampanha) ? (
                    <Button disabled className="bg-primary/50">
                      Solicitação enviada ✓
                    </Button>
                  ) : (
                    <Button
                      className="bg-primary hover:bg-accent"
                      onClick={() => handlePedirEntrar(campanha.idcampanha)}
                      disabled={enviando === campanha.idcampanha}
                    >
                      {enviando === campanha.idcampanha ? "Enviando..." : "Pedir para Entrar"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/" className="text-primary hover:text-accent inline-flex items-center gap-2">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </>
  );
}
