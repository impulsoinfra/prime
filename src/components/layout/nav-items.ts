import {
  IconCalendar,
  IconChartBar,
  IconHome,
  IconUser,
  type Icon,
} from "@tabler/icons-react";

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Hoy", icon: IconHome },
  { href: "/app/progreso", label: "Progreso", icon: IconChartBar },
  { href: "/app/rutina", label: "Rutina", icon: IconCalendar },
  { href: "/app/perfil", label: "Perfil", icon: IconUser },
];
