import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCharacterSheets } from "../contexts/CharacterSheetContext";
import { useCampaigns } from "../contexts/CampaignContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, FileText, Upload, Trash2, Download, FileCheck, Edit } from "lucide-react";
import { UserNavigation } from "./UserNavigation";

export function CharacterSheets() {
  const { user } = useAuth();
  const { sheets, getUserSheets, createSheet, updateSheet, deleteSheet, uploadPDF } = useCharacterSheets();
  const { getUserGroups } = useCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [uploadingSheetId, setUploadingSheetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSheet, setNewSheet] = useState({
    name: "",
    class: "",
    level: 1,
    race: "",
    system: "D&D 5e",
    campaignId: "",
  });

  const userSheets = user ? getUserSheets(user.email) : [];
  const userGroups = user ? getUserGroups(user.email) : [];

  // Get all campaigns from all user groups
  const allCampaigns = userGroups.flatMap(group =>
    group.campaigns.map(campaign => ({
      ...campaign,
      groupName: group.name,
    }))
  );

  const handleCreateSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSheet.name && newSheet.class && newSheet.race && user) {
      createSheet({
        ...newSheet,
        campaignId: newSheet.campaignId || undefined,
        userId: user.email,
      });
      setNewSheet({
        name: "",
        class: "",
        level: 1,
        race: "",
        system: "D&D 5e",
        campaignId: "",
      });
      setShowCreateForm(false);
    }
  };

  const handleEditSheet = (sheetId: string) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (sheet) {
      setNewSheet({
        name: sheet.name,
        class: sheet.class,
        level: sheet.level,
        race: sheet.race,
        system: sheet.system,
        campaignId: sheet.campaignId || "",
      });
      setEditingSheetId(sheetId);
      setShowCreateForm(true);
    }
  };

  const handleUpdateSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSheetId && newSheet.name && newSheet.class && newSheet.race) {
      updateSheet(editingSheetId, {
        ...newSheet,
        campaignId: newSheet.campaignId || undefined,
      });
      setNewSheet({
        name: "",
        class: "",
        level: 1,
        race: "",
        system: "D&D 5e",
        campaignId: "",
      });
      setEditingSheetId(null);
      setShowCreateForm(false);
    }
  };

  const handleCancelEdit = () => {
    setNewSheet({
      name: "",
      class: "",
      level: 1,
      race: "",
      system: "D&D 5e",
      campaignId: "",
    });
    setEditingSheetId(null);
    setShowCreateForm(false);
  };

  const handleDeleteSheet = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta ficha?")) {
      deleteSheet(id);
    }
  };

  const handleFileUpload = async (sheetId: string, file: File) => {
    if (file.type !== "application/pdf") {
      alert("Por favor, envie apenas arquivos PDF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("O arquivo é muito grande. Tamanho máximo: 10MB");
      return;
    }

    setUploadingSheetId(sheetId);
    try {
      await uploadPDF(sheetId, file);
    } catch (error) {
      alert("Erro ao fazer upload do arquivo. Tente novamente.");
    } finally {
      setUploadingSheetId(null);
    }
  };

  const triggerFileInput = (sheetId: string) => {
    setUploadingSheetId(sheetId);
    fileInputRef.current?.click();
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
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary hover:bg-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Ficha
          </Button>
        </div>

        {/* Create/Edit Sheet Form */}
        {showCreateForm && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">
                {editingSheetId ? "Editar Ficha" : "Criar Nova Ficha"}
              </CardTitle>
              <CardDescription>Preencha as informações básicas do personagem</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingSheetId ? handleUpdateSheet : handleCreateSheet} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Nome do Personagem</Label>
                    <Input
                      id="name"
                      value={newSheet.name}
                      onChange={(e) => setNewSheet({ ...newSheet, name: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Aragorn"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system" className="text-foreground">Sistema</Label>
                    <Select
                      value={newSheet.system}
                      onValueChange={(value) => setNewSheet({ ...newSheet, system: value })}
                    >
                      <SelectTrigger className="bg-input-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="D&D 5e">D&D 5e</SelectItem>
                        <SelectItem value="Pathfinder 2e">Pathfinder 2e</SelectItem>
                        <SelectItem value="Call of Cthulhu">Call of Cthulhu</SelectItem>
                        <SelectItem value="Shadowrun">Shadowrun</SelectItem>
                        <SelectItem value="Vampire: The Masquerade">Vampire: The Masquerade</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-foreground">Classe</Label>
                    <Input
                      id="class"
                      value={newSheet.class}
                      onChange={(e) => setNewSheet({ ...newSheet, class: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Guerreiro, Mago, Ladino"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="race" className="text-foreground">Raça/Ancestralidade</Label>
                    <Input
                      id="race"
                      value={newSheet.race}
                      onChange={(e) => setNewSheet({ ...newSheet, race: e.target.value })}
                      className="bg-input-background border-input"
                      placeholder="Ex: Humano, Elfo, Anão"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-foreground">Nível</Label>
                    <Input
                      id="level"
                      type="number"
                      min="1"
                      max="20"
                      value={newSheet.level}
                      onChange={(e) => setNewSheet({ ...newSheet, level: parseInt(e.target.value) || 1 })}
                      className="bg-input-background border-input"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="campaign" className="text-foreground">Campanha *</Label>
                    <Select
                      value={newSheet.campaignId}
                      onValueChange={(value) => setNewSheet({ ...newSheet, campaignId: value })}
                      required
                    >
                      <SelectTrigger className="bg-input-background border-input">
                        <SelectValue placeholder="Selecione uma campanha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma campanha</SelectItem>
                        {allCampaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name} ({campaign.groupName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary hover:bg-accent">
                    {editingSheetId ? "Salvar Alterações" : "Criar Ficha"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-border"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Hidden file input for PDF upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && uploadingSheetId) {
              handleFileUpload(uploadingSheetId, file);
            }
            e.target.value = ""; // Reset input
          }}
        />

        {/* Sheets List */}
        {userSheets.length === 0 ? (
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
            {userSheets.map((sheet) => (
              <Card
                key={sheet.id}
                className="bg-card border-border hover:border-primary transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-foreground text-xl">{sheet.name}</CardTitle>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {sheet.race} {sheet.class} - Nível {sheet.level}
                        </p>
                        <div className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                          {sheet.system}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSheet(sheet.id)}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSheet(sheet.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* PDF Status */}
                    {sheet.pdfFile ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">PDF Anexado</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{sheet.pdfFile.name}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            onClick={() => window.open(sheet.pdfFile!.url, '_blank')}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Visualizar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => triggerFileInput(sheet.id)}
                            disabled={uploadingSheetId === sheet.id}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            {uploadingSheetId === sheet.id ? "Enviando..." : "Trocar"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
                        onClick={() => triggerFileInput(sheet.id)}
                        disabled={uploadingSheetId === sheet.id}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingSheetId === sheet.id ? "Enviando PDF..." : "Anexar PDF da Ficha"}
                      </Button>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                      <p>Criada em {sheet.createdAt.toLocaleDateString('pt-BR')}</p>
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
