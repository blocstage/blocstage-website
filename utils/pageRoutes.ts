import BuyTicketPage from "@/components/BuyTicketPage";
import { createSlug } from "../lib/slugUtils";

export const pageRoutes = {
  home: "/",

  // Authentication Routes
  signup: "/sign-up",
  emailSent: "/email-sent",
  verifyOtp: "/verify-otp",
  verificationStatus: "/verification-status",
  login: "/login",
  forgotPassword: "/forgot-password",

  // Events routes
  events: "/events",
  createEvent: "/events/create",
  editEvent: (eventId: string) => `/events/${eventId}/edit`,
  previewEvent: (event: { short_code?: string; title: string; id: string }) => {
    const slug = event.short_code || `${createSlug(event.title)}--${event.id}`;
    return `/events/${slug}/preview`;
  },

  // Tickets routes
  buyTicketsPage : (eventId: string) => `/buy-ticket?eventId=${eventId}`,

  //profile routes
  editProfile : '/edit-profile',


  //my tickets
  myTickets : '/my-tickets',
};
