import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthProvider } from "../contexts/AuthContext";
import { CampaignProvider } from "../contexts/CampaignContext";
import { CharacterSheetProvider } from "../contexts/CharacterSheetContext";

export function Root() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <CharacterSheetProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </CharacterSheetProvider>
      </CampaignProvider>
    </AuthProvider>
  );
}