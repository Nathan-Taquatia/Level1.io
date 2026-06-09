import { Link, useLocation } from "react-router";
import { cn } from "./ui/utils";
import { Home, Users, BookOpen, FileText } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "Grupos", path: "/meus-grupos", icon: Users },
  { label: "Campanhas", path: "/minhas-campanhas", icon: BookOpen },
  { label: "Fichas", path: "/fichas", icon: FileText },
];

export function UserNavigation() {
  const location = useLocation();

  return (
    <div className="border-b border-border bg-card/30">
      <div className="container mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                  isActive
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
