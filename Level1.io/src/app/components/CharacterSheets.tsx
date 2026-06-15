import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getFichasUsuario, criarFicha, deletarFicha } from "../service/fichas";
import { getGruposUsuario } from "../service/grupos";
import { getCampanhasGrupo } from "../service/campanhas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, FileText, Upload, Trash2, FileCheck, Download } from "lucide-react";
import { UserNavigation } from "./UserNavigation";

interface FichaAPI {
  idficha: number;
  nomepersonagem: string;
  classe: string | null;
  nivel: number;
  raca: string | null;
  idusuario: number;
  idcampanha: number | null;
  pdf_url: string | null;
  pdf_nome: string | null;
  criado_em: string;
  nomesistema: string | null;
  campanhanome: string | null;
}

interface CampanhaOpcao {
  idcampanha: number;
  campanhanome: string;
  gruponomes: string;
}

export function CharacterSheets() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fichas, setFichas] = useState<FichaAPI[]>([]);
  const [campanhas, setCampanhas] = useState<CampanhaOpcao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [criando, setCriando] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const [newSheet, setNewSheet] = useState({
    nomepersonagem: "",
    classe: "",
    nivel: 1,
    raca: "",
    idcampanha: "",
  });

  async function carregarFichas() {
    if (!user?.id_usuario) return;
    try {
      const dados = await getFichasUsuario(user.id_usuario);
      setFichas(dados);
    } catch {
      setErro("Erro ao carregar fichas.");
    } finally {
      setCarregando(false);
    }
  }

  async function carregarCampanhas() {
    if (!user?.id_usuario) return;
    try {
      const grupos = await getGruposUsuario(user.id_usuario);
      const todasCampanhas: CampanhaOpcao[] = [];
      for (const grupo of grupos) {
        const camps = await getCampanhasGrupo(grupo.idgrupos);
        camps.forEach((c: { idcampanha: number; campanhanome: string }) =>
          todasCampanhas.push({ idcampanha: c.idcampanha, campanhanome: c.campanhanome, gruponomes: grupo.gruponomes })
        );
      }
      setCampanhas(todasCampanhas);
    } catch {
      // campanhas são opcionais, não bloqueia
    }
  }

  useEffect(() => {
    setCarregando(true);
    carregarFichas();
    carregarCampanhas();
  }, [user?.id_usuario]);

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSheet.nomepersonagem || !user?.id_usuario) return;
    setCriando(true);
    try {
      await criarFicha({
        nomepersonagem: newSheet.nomepersonagem,
        classe: newSheet.classe || undefined,
        nivel: newSheet.nivel,
        raca: newSheet.raca || undefined,
        idusuario: user.id_usuario,
        idcampanha: newSheet.idcampanha ? Number(newSheet.idcampanha) : undefined,
      });
      setNewSheet({ nomepersonagem: "", classe: "", nivel: 1, raca: "", idcampanha: "" });
      setShowCreateForm(false);
      await carregarFichas();
    } catch {
      setErro("Erro ao criar ficha.");
    } finally {
      setCriando(false);
    }
  };

  const handleDelete = async (idficha: number) => {
    if (!confirm("Tem certeza que deseja excluir esta ficha?")) return;
    try {
      await deletarFicha(idficha);
      setFichas(fichas.filter(f => f.idficha !== idficha));
    } catch {
      setErro("Erro ao deletar ficha.");
    }
  };

  const handleFileUpload = (idficha: number, file: File) => {
    if (file.type !== "application/pdf") {
      alert("Por favor, envie apenas arquivos PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("O arquivo é muito grande. Tamanho máximo: 10MB");
      return;
    }
    // PDF upload será integrado com Supabase Storage futuramente
    alert("Upload de PDF será disponibilizado em breve com integração ao Supabase Storage.");
    setUploadingId(null);
  };

  return (
    <>
      <UserNavigation />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-foreground mb-2">Minhas Fichas</h1>
            <p className="text-muted-foreground">Gerencie suas fichas de personagens de RPG</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-primary hover:bg-accent">
            <Plus className="w-4 h-4 mr-2" />
            Nova Ficha
          </Button>
        </div>

        {erro && <p className="text-destructive text-sm mb-4">{erro}</p>}

        {/* Create Form */}
        {showCreateForm && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Criar Nova Ficha</CardTitle>
              <CardDescription>Preencha as informações básicas do personagem</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSheet} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Nome do Personagem</Label>
                    <Input
                      value={newSheet.nomepersonagem}
                      onChange={(e) => setNewSheet({ ...newSheet, nomepersonagem: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Aragorn"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Classe <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Input
                      value={newSheet.classe}
                      onChange={(e) => setNewSheet({ ...newSheet, classe: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Guerreiro, Mago, Ladino"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Raça/Ancestralidade <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Input
                      value={newSheet.raca}
                      onChange={(e) => setNewSheet({ ...newSheet, raca: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Humano, Elfo, Anão"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Nível</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={newSheet.nivel}
                      onChange={(e) => setNewSheet({ ...newSheet, nivel: parseInt(e.target.value) || 1 })}
                      className="bg-input-background border-input"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground">Campanha <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Select value={newSheet.idcampanha} onValueChange={(v) => setNewSheet({ ...newSheet, idcampanha: v })}>
                      <SelectTrigger className="bg-input-background border-input">
                        <SelectValue placeholder="Selecione uma campanha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma campanha</SelectItem>
                        {campanhas.map((c) => (
                          <SelectItem key={c.idcampanha} value={String(c.idcampanha)}>
                            {c.campanhanome} ({c.gruponomes})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary hover:bg-accent" disabled={criando}>
                    {criando ? "Criando..." : "Criar Ficha"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="border-border">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && uploadingId !== null) handleFileUpload(uploadingId, file);
            e.target.value = "";
          }}
        />

        {/* Sheets List */}
        {carregando ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Carregando fichas...</p>
            </CardContent>
          </Card>
        ) : fichas.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Você ainda não tem fichas de personagem.
                <br />
                Crie sua primeira ficha para começar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fichas.map((ficha) => (
              <Card key={ficha.idficha} className="bg-card border-border hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-foreground text-xl">{ficha.nomepersonagem}</CardTitle>
                      </div>
                      <div className="space-y-1">
                        {(ficha.raca || ficha.classe) && (
                          <p className="text-sm text-muted-foreground">
                            {[ficha.raca, ficha.classe].filter(Boolean).join(" ")} — Nível {ficha.nivel}
                          </p>
                        )}
                        {ficha.nomesistema && (
                          <div className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                            {ficha.nomesistema}
                          </div>
                        )}
                        {ficha.campanhanome && (
                          <p className="text-xs text-muted-foreground">Campanha: {ficha.campanhanome}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ficha.idficha)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ficha.pdf_url ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">PDF Anexado</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{ficha.pdf_nome}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => window.open(ficha.pdf_url!, '_blank')}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
                        onClick={() => { setUploadingId(ficha.idficha); fileInputRef.current?.click(); }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Anexar PDF da Ficha
                      </Button>
                    )}
                    <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                      <p>Criada em {new Date(ficha.criado_em).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
