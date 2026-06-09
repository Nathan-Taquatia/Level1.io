import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { Groups } from "./components/Groups";
import { MyGroups } from "./components/MyGroups";
import { MyCampaigns } from "./components/MyCampaigns";
import { CharacterSheets } from "./components/CharacterSheets";
import { Campaigns } from "./components/Campaigns";
import { Tips } from "./components/Tips";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "cadastro", Component: Signup },
      { path: "dashboard", Component: Dashboard },
      { path: "grupos", Component: Groups },
      { path: "meus-grupos", Component: MyGroups },
      { path: "minhas-campanhas", Component: MyCampaigns },
      { path: "fichas", Component: CharacterSheets },
      { path: "aventuras", Component: Campaigns },
      { path: "dicas", Component: Tips },
    ],
  },
]);
