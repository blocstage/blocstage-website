import { CalendarDays, Trophy, Ticket,  } from "lucide-react";
import { pageRoutes } from "./pageRoutes";

export const menuItems = [
  {
    icon: CalendarDays,
    title: "Events",
    route: pageRoutes.events,
    active: true,
  },
  { icon: Ticket, title: "My Tickets", route: "#" },
  { icon: Trophy, title: "Rewards", route: "#" },
];
