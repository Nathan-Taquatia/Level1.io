import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { Groups } from "./components/Groups";
import { MyCampaigns } from "./components/MyCampaigns";
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
      { path: "minhas-campanhas", Component: MyCampaigns },
      { path: "dicas", Component: Tips },
    ],
  },
]);
