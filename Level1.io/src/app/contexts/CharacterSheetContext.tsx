import { createContext, useContext, useState, ReactNode } from 'react';

export interface CharacterSheet {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  system: string; // D&D 5e, Pathfinder, etc
  campaignId?: string; // Optional: link to a campaign
  pdfFile?: {
    name: string;
    size: number;
    url: string; // Mock URL for now, will be Supabase URL later
    uploadedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface CharacterSheetContextType {
  sheets: CharacterSheet[];
  getUserSheets: (userId: string) => CharacterSheet[];
  createSheet: (sheet: Omit<CharacterSheet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSheet: (id: string, updates: Partial<CharacterSheet>) => void;
  deleteSheet: (id: string) => void;
  uploadPDF: (sheetId: string, file: File) => Promise<void>;
}

const CharacterSheetContext = createContext<CharacterSheetContextType | undefined>(undefined);

export function CharacterSheetProvider({ children }: { children: ReactNode }) {
  const [sheets, setSheets] = useState<CharacterSheet[]>([
    // Mock data for testing
    {
      id: 'sheet-1',
      name: 'Aragorn',
      class: 'Ranger',
      level: 10,
      race: 'Humano',
      system: 'D&D 5e',
      userId: 'user-1',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-03-20'),
    },
  ]);

  const getUserSheets = (userId: string): CharacterSheet[] => {
    return sheets.filter(sheet => sheet.userId === userId);
  };

  const createSheet = (sheetData: Omit<CharacterSheet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSheet: CharacterSheet = {
      ...sheetData,
      id: `sheet-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSheets([...sheets, newSheet]);
  };

  const updateSheet = (id: string, updates: Partial<CharacterSheet>) => {
    setSheets(sheets.map(sheet => {
      if (sheet.id === id) {
        return {
          ...sheet,
          ...updates,
          updatedAt: new Date(),
        };
      }
      return sheet;
    }));
  };

  const deleteSheet = (id: string) => {
    setSheets(sheets.filter(sheet => sheet.id !== id));
  };

  const uploadPDF = async (sheetId: string, file: File): Promise<void> => {
    // Mock upload - in production this will upload to Supabase Storage
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        updateSheet(sheetId, {
          pdfFile: {
            name: file.name,
            size: file.size,
            url: mockUrl,
            uploadedAt: new Date(),
          },
        });
        resolve();
      }, 1000); // Simulate upload delay
    });
  };

  return (
    <CharacterSheetContext.Provider
      value={{
        sheets,
        getUserSheets,
        createSheet,
        updateSheet,
        deleteSheet,
        uploadPDF,
      }}
    >
      {children}
    </CharacterSheetContext.Provider>
  );
}

export function useCharacterSheets() {
  const context = useContext(CharacterSheetContext);
  if (context === undefined) {
    throw new Error('useCharacterSheets must be used within a CharacterSheetProvider');
  }
  return context;
}
