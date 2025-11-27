import { CalendarDays, Trophy, Ticket } from "lucide-react";
import { pageRoutes } from "./pageRoutes";

export const menuItems = [
  {
    icon: CalendarDays,
    title: "Events",
    route: pageRoutes.events,
  },
  { icon: Ticket, title: "My Tickets", route: pageRoutes.myTickets },

  { icon: Trophy, title: "Rewards", route: "#" },
];
