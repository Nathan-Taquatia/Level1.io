import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getFichasUsuario, criarFicha, atualizarFicha, deletarFicha, uploadPDFFicha, getPDFUrl } from "../service/fichas";
import { getGruposUsuario } from "../service/grupos";
import { getCampanhasGrupo } from "../service/campanhas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, FileText, Upload, Trash2, FileCheck, Download, Edit } from "lucide-react";
import { UserNavigation } from "./UserNavigation";

interface FichaAPI {
  idficha: number;
  nomepersonagem: string;
  classe: string | null;
  nivel: number;
  raca: string | null;
  idusuario: number;
  idcampanha: number | null;
  idsistema: number | null;
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

interface SistemaOpcao {
  idsistema: number;
  nomesistema: string;
}

const emptySheet = { nomepersonagem: "", classe: "", nivel: 1, raca: "", idcampanha: "", idsistema: "" };

export function CharacterSheets() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fichas, setFichas] = useState<FichaAPI[]>([]);
  const [campanhas, setCampanhas] = useState<CampanhaOpcao[]>([]);
  const [sistemas, setSistemas] = useState<SistemaOpcao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [criando, setCriando] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [sheet, setSheet] = useState(emptySheet);

  // Busca as fichas do usuario no banco
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

  // Busca campanhas do usuario para popular o dropdown do formulario
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
    } catch {}
  }

  // Busca os sistemas de regras cadastrados para popular o dropdown
  async function carregarSistemas() {
    try {
      const resposta = await fetch('https://level1-io-service.onrender.com/sistema');
      if (resposta.ok) setSistemas(await resposta.json());
    } catch {}
  }

  // Carrega fichas, campanhas e sistemas ao montar o componente
  useEffect(() => {
    setCarregando(true);
    carregarFichas();
    carregarCampanhas();
    carregarSistemas();
  }, [user?.id_usuario]);

  // Cria ou atualiza uma ficha dependendo se esta em modo de edicao
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheet.nomepersonagem || !user?.id_usuario) return;
    setCriando(true);
    setErro("");
    try {
      const dados = {
        nomepersonagem: sheet.nomepersonagem,
        classe: sheet.classe || undefined,
        nivel: sheet.nivel,
        raca: sheet.raca || undefined,
        idcampanha: sheet.idcampanha && sheet.idcampanha !== 'none' ? Number(sheet.idcampanha) : undefined,
        idsistema: sheet.idsistema && sheet.idsistema !== 'none' ? Number(sheet.idsistema) : undefined,
      };

      if (editandoId) {
        await atualizarFicha(editandoId, dados);
      } else {
        await criarFicha({ ...dados, idusuario: user.id_usuario });
      }

      setSheet(emptySheet);
      setShowCreateForm(false);
      setEditandoId(null);
      await carregarFichas();
    } catch {
      setErro(editandoId ? "Erro ao atualizar ficha." : "Erro ao criar ficha.");
    } finally {
      setCriando(false);
    }
  };

  // Preenche o formulario com os dados da ficha selecionada para edicao
  const handleEditar = (ficha: FichaAPI) => {
    setSheet({
      nomepersonagem: ficha.nomepersonagem,
      classe: ficha.classe ?? "",
      nivel: ficha.nivel,
      raca: ficha.raca ?? "",
      idcampanha: ficha.idcampanha ? String(ficha.idcampanha) : "",
      idsistema: ficha.idsistema ? String(ficha.idsistema) : "",
    });
    setEditandoId(ficha.idficha);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Limpa o formulario e cancela o modo de edicao
  const handleCancelar = () => {
    setSheet(emptySheet);
    setEditandoId(null);
    setShowCreateForm(false);
  };

  // Remove a ficha do banco e atualiza a lista localmente
  const handleDelete = async (idficha: number) => {
    if (!confirm("Tem certeza que deseja excluir esta ficha?")) return;
    try {
      await deletarFicha(idficha);
      setFichas(fichas.filter(f => f.idficha !== idficha));
    } catch {
      setErro("Erro ao deletar ficha.");
    }
  };

  // Envia o PDF para o banco como LONGBLOB e atualiza a ficha
  const handleFileUpload = async (idficha: number, file: File) => {
    if (file.type !== "application/pdf") {
      alert("Por favor, envie apenas arquivos PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("O arquivo é muito grande. Tamanho máximo: 10MB");
      return;
    }
    setUploadingId(idficha);
    try {
      await uploadPDFFicha(idficha, file);
      await carregarFichas();
    } catch {
      alert("Erro ao fazer upload do PDF. Tente novamente.");
    } finally {
      setUploadingId(null);
    }
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
          <Button onClick={() => { handleCancelar(); setShowCreateForm(true); }} className="bg-primary hover:bg-accent">
            <Plus className="w-4 h-4 mr-2" />
            Nova Ficha
          </Button>
        </div>

        {erro && <p className="text-destructive text-sm mb-4">{erro}</p>}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">
                {editandoId ? "Editar Ficha" : "Criar Nova Ficha"}
              </CardTitle>
              <CardDescription>Preencha as informações básicas do personagem</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Nome do Personagem</Label>
                    <Input
                      value={sheet.nomepersonagem}
                      onChange={(e) => setSheet({ ...sheet, nomepersonagem: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Aragorn"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Classe <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Input
                      value={sheet.classe}
                      onChange={(e) => setSheet({ ...sheet, classe: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Guerreiro, Mago, Ladino"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Raça/Ancestralidade <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Input
                      value={sheet.raca}
                      onChange={(e) => setSheet({ ...sheet, raca: e.target.value })}
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
                      value={sheet.nivel}
                      onChange={(e) => setSheet({ ...sheet, nivel: parseInt(e.target.value) || 1 })}
                      className="bg-input-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Sistema <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Select value={sheet.idsistema} onValueChange={(v) => setSheet({ ...sheet, idsistema: v })}>
                      <SelectTrigger className="bg-input-background border-input">
                        <SelectValue placeholder="Selecione o sistema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {sistemas.map((s) => (
                          <SelectItem key={s.idsistema} value={String(s.idsistema)}>
                            {s.nomesistema}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Campanha <span className="text-muted-foreground text-sm">(opcional)</span></Label>
                    <Select value={sheet.idcampanha} onValueChange={(v) => setSheet({ ...sheet, idcampanha: v })}>
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
                    {criando ? "Salvando..." : editandoId ? "Salvar Alterações" : "Criar Ficha"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelar} className="border-border">
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
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditar(ficha)}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ficha.idficha)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ficha.pdf_nome ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">PDF Anexado</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{ficha.pdf_nome}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            onClick={() => window.open(getPDFUrl(ficha.idficha), '_blank')}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Visualizar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => { setUploadingId(ficha.idficha); fileInputRef.current?.click(); }}
                            disabled={uploadingId === ficha.idficha}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            {uploadingId === ficha.idficha ? "Enviando..." : "Trocar"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
                        onClick={() => { setUploadingId(ficha.idficha); fileInputRef.current?.click(); }}
                        disabled={uploadingId === ficha.idficha}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingId === ficha.idficha ? "Enviando..." : "Anexar PDF da Ficha"}
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
