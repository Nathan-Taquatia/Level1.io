import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, BookOpen, Users, Trash2 } from "lucide-react";

export function MyCampaigns() {
  const { user } = useAuth();
  const { groups, getUserGroups, createCampaign, deleteCampaign } = useCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "original" as "original" | "official",
    rulesSystem: "",
    description: "",
  });

  const userGroups = user ? getUserGroups(user.email) : [];

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup && newCampaign.name && newCampaign.rulesSystem) {
      createCampaign(selectedGroup, newCampaign);
      setNewCampaign({
        name: "",
        type: "original",
        rulesSystem: "",
        description: "",
      });
      setShowCreateForm(false);
    }
  };

  const handleDeleteCampaign = (groupId: string, campaignId: string) => {
    if (confirm("Tem certeza que deseja excluir esta campanha?")) {
      deleteCampaign(groupId, campaignId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl text-foreground mb-2">Minhas Campanhas</h1>
          <p className="text-muted-foreground">Gerencie e participe de campanhas dos seus grupos</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

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
                <Label htmlFor="group" className="text-foreground">Grupo</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="bg-input-background border-input">
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {userGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome da Campanha</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="bg-input-background border-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">Tipo de Campanha</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(value: "original" | "official") =>
                    setNewCampaign({ ...newCampaign, type: value })
                  }
                >
                  <SelectTrigger className="bg-input-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="official">Oficial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rulesSystem" className="text-foreground">Sistema de Regras</Label>
                <Input
                  id="rulesSystem"
                  value={newCampaign.rulesSystem}
                  onChange={(e) => setNewCampaign({ ...newCampaign, rulesSystem: e.target.value })}
                  className="bg-input-background border-input"
                  placeholder="Ex: D&D 5e, Shadowrun 6e, Call of Cthulhu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Descrição</Label>
                <Textarea
                  id="description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  className="bg-input-background border-input min-h-[100px]"
                  placeholder="Descreva a história e contexto da campanha..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-accent">
                  Criar Campanha
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-border"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns by Group */}
      {userGroups.length === 0 ? (
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
      ) : (
        <div className="space-y-8">
          {userGroups.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-2xl text-foreground">{group.name}</h2>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>

              {group.campaigns.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      Este grupo ainda não tem campanhas.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.campaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className="bg-card border-border hover:border-primary transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          {user?.email === group.dmId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCampaign(group.id, campaign.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <CardTitle className="text-foreground">{campaign.name}</CardTitle>
                        <CardDescription>
                          <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs mr-2">
                            {campaign.type === "original" ? "Original" : "Oficial"}
                          </span>
                          <span className="text-muted-foreground">{campaign.rulesSystem}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{campaign.description}</p>
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            Criada em {campaign.createdAt.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
