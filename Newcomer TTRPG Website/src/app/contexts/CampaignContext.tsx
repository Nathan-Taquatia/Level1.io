import { createContext, useContext, useState, ReactNode } from 'react';

export interface Campaign {
  id: string;
  name: string;
  type: 'original' | 'official';
  rulesSystem: string;
  description: string;
  groupId: string;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberIds: string[]; // User IDs
  campaigns: Campaign[];
  dmId: string; // User ID of the DM
}

interface CampaignContextType {
  groups: Group[];
  getUserGroups: (userId: string) => Group[];
  getGroupCampaigns: (groupId: string) => Campaign[];
  createGroup: (name: string, description: string, dmId: string) => void;
  createCampaign: (groupId: string, campaign: Omit<Campaign, 'id' | 'createdAt' | 'groupId'>) => void;
  joinGroup: (groupId: string, userId: string) => void;
  deleteCampaign: (groupId: string, campaignId: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([
    // Mock data for testing
    {
      id: 'group-1',
      name: 'Aventureiros de Faerûn',
      description: 'Grupo focado em D&D 5e com campanhas épicas',
      memberIds: ['user-1', 'user-2', 'user-3'],
      dmId: 'user-1',
      campaigns: [
        {
          id: 'campaign-1',
          name: 'A Queda de Waterdeep',
          type: 'official',
          rulesSystem: 'D&D 5e',
          description: 'Uma campanha épica ambientada em Forgotten Realms, onde os heróis devem salvar a cidade de Waterdeep de uma ameaça ancestral.',
          groupId: 'group-1',
          createdAt: new Date('2026-04-15'),
        },
      ],
    },
    {
      id: 'group-2',
      name: 'Corredores Sombrios',
      description: 'Explorando o mundo cyberpunk de Shadowrun',
      memberIds: ['user-1', 'user-4'],
      dmId: 'user-4',
      campaigns: [
        {
          id: 'campaign-2',
          name: 'Neon Shadows',
          type: 'original',
          rulesSystem: 'Shadowrun 6e',
          description: 'Uma história original de shadowrunners tentando sobreviver nas ruas de Seattle.',
          groupId: 'group-2',
          createdAt: new Date('2026-03-20'),
        },
      ],
    },
  ]);

  const getUserGroups = (userId: string): Group[] => {
    return groups.filter(group =>
      group.memberIds.includes(userId) || group.dmId === userId
    );
  };

  const getGroupCampaigns = (groupId: string): Campaign[] => {
    const group = groups.find(g => g.id === groupId);
    return group?.campaigns || [];
  };

  const createGroup = (name: string, description: string, dmId: string) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description,
      memberIds: [dmId],
      dmId,
      campaigns: [],
    };
    setGroups([...groups, newGroup]);
  };

  const createCampaign = (groupId: string, campaignData: Omit<Campaign, 'id' | 'createdAt' | 'groupId'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      groupId,
      createdAt: new Date(),
    };

    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          campaigns: [...group.campaigns, newCampaign],
        };
      }
      return group;
    }));
  };

  const joinGroup = (groupId: string, userId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId && !group.memberIds.includes(userId)) {
        return {
          ...group,
          memberIds: [...group.memberIds, userId],
        };
      }
      return group;
    }));
  };

  const deleteCampaign = (groupId: string, campaignId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          campaigns: group.campaigns.filter(c => c.id !== campaignId),
        };
      }
      return group;
    }));
  };

  return (
    <CampaignContext.Provider
      value={{
        groups,
        getUserGroups,
        getGroupCampaigns,
        createGroup,
        createCampaign,
        joinGroup,
        deleteCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
}
