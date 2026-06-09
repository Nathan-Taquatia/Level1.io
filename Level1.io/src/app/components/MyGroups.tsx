import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Users, Plus, Crown, UserPlus, Calendar } from "lucide-react";
import { Link } from "react-router";
import { UserNavigation } from "./UserNavigation";

export function MyGroups() {
  const { user, isAuthenticated } = useAuth();
  const { groups, getUserGroups, createGroup } = useCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [managingGroupId, setManagingGroupId] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });

  const userGroups = user ? getUserGroups(user.email) : [];

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroup.name && newGroup.description && user) {
      createGroup(newGroup.name, newGroup.description, user.email);
      setNewGroup({
        name: "",
        description: "",
      });
      setShowCreateForm(false);
    }
  };

  const isUserDM = (groupDmId: string) => {
    return user?.email === groupDmId;
  };

  const managingGroup = managingGroupId ? groups.find(g => g.id === managingGroupId) : null;

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
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary hover:bg-accent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Grupo
            </Button>
          )}
        </div>

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
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-accent">
                  Criar Grupo
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

      {/* Groups List */}
      {userGroups.length === 0 ? (
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
          {userGroups.map((group) => (
            <Card
              key={group.id}
              className="bg-card border-border hover:border-primary transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <CardTitle className="text-foreground text-xl">{group.name}</CardTitle>
                    </div>
                    {isUserDM(group.dmId) && (
                      <div className="inline-flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium mb-2">
                        <Crown className="w-3 h-3" />
                        Você é o Mestre
                      </div>
                    )}
                    <CardDescription className="text-sm">
                      {group.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Members Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{group.memberIds.length} {group.memberIds.length === 1 ? 'membro' : 'membros'}</span>
                  </div>

                  {/* Campaigns Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{group.campaigns.length} {group.campaigns.length === 1 ? 'campanha' : 'campanhas'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Link to="/minhas-campanhas" className="flex-1">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        Ver Campanhas
                      </Button>
                    </Link>
                    {isUserDM(group.dmId) && (
                      <Button
                        variant="outline"
                        className="border-border"
                        onClick={() => setManagingGroupId(group.id)}
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
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Gerenciar Grupo: {managingGroup.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setManagingGroupId(null)}
              >
                ✕
              </Button>
            </div>
            <CardDescription>Visualize membros e informações do grupo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Group Info */}
              <div className="space-y-2">
                <Label className="text-foreground">Nome do Grupo</Label>
                <p className="text-muted-foreground">{managingGroup.name}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Descrição</Label>
                <p className="text-muted-foreground">{managingGroup.description}</p>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <Label className="text-foreground">Membros ({managingGroup.memberIds.length})</Label>
                <div className="space-y-2">
                  {managingGroup.memberIds.map((memberId, index) => (
                    <div
                      key={memberId}
                      className="flex items-center justify-between p-2 bg-card/50 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">
                          {memberId === managingGroup.dmId ? "Mestre (você)" : `Jogador ${index + 1}`}
                        </span>
                      </div>
                      {memberId === managingGroup.dmId && (
                        <Crown className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns */}
              <div className="space-y-2">
                <Label className="text-foreground">Campanhas ({managingGroup.campaigns.length})</Label>
                <div className="space-y-2">
                  {managingGroup.campaigns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma campanha criada ainda.</p>
                  ) : (
                    managingGroup.campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="p-2 bg-card/50 border border-border rounded-lg"
                      >
                        <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{campaign.rulesSystem}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Link to="/minhas-campanhas" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-accent">
                    Gerenciar Campanhas
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setManagingGroupId(null)}
                  className="border-border"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Find Groups CTA */}
      {userGroups.length > 0 && (
        <Card className="bg-card/50 border-border mt-8">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Procurando por mais aventuras?
            </p>
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
