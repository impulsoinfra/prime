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
  { href: "/", label: "Hoy", icon: IconHome },
  { href: "/progreso", label: "Progreso", icon: IconChartBar },
  { href: "/rutina", label: "Rutina", icon: IconCalendar },
  { href: "/perfil", label: "Perfil", icon: IconUser },
];
