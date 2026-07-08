import {
  LayoutDashboard,
  Building2,
  FileText,
  Map,
  Sparkles,
  LayoutTemplate,
  BookOpen,
  Settings,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", key: "missionControl", icon: LayoutDashboard },
  { href: "/businesses", key: "businesses", icon: Building2 },
  { href: "/blueprint", key: "blueprint", icon: FileText },
  { href: "/roadmap", key: "roadmap", icon: Map },
  { href: "/co-founder", key: "coFounder", icon: Sparkles },
  { href: "/templates", key: "templates", icon: LayoutTemplate },
  { href: "/resources", key: "resources", icon: BookOpen },
  { href: "/settings", key: "settings", icon: Settings },
] as const;
