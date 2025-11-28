import Image from "next/image";
import { MapPin, CalendarDays, Clock } from "lucide-react";

import SpeakerCard from "@/components/SpeakerCard";
import ShareButton from "@/components/ShareButton";
import Header2 from "@/components/landing/Header2";
import Footer from "@/components/landing/Footer";
import {
  extractEventIdFromSlug,
  createSlug,
  findEventByTitleSlug,
} from "@/lib/slugUtils";
import { pageRoutes } from "@/utils/pageRoutes";

type Session = {
  title: string;
  start_time: string;
  end_time: string;
  speaker_name: string;
  image_url?: string;
};

type EventData = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  image_url?: string;
  sessions: Session[];
};

// Fetch sessions from the API
async function fetchEventSessions(eventId: string): Promise<Session[]> {
  try {
    const response = await fetch(
      `https://api.blocstage.com/events/${eventId}/sessions`
    );
    if (!response.ok) return [];
    const sessions = await response.json();
    return Array.isArray(sessions) ? sessions : [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const response = await fetch("https://api.blocstage.com/events");
  const events = await response.json();
  return events.map((event: EventData) => ({
    eventId: createSlug(event.title),
  }));
}

export default async function EventPreviewPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId: eventSlug } = params;

  let eventId: string | null = null;
  let eventTitle: string | null = null;

  // Try fetching directly using short code
  const directResponse = await fetch(
    `https://api.blocstage.com/e/${eventSlug}`
  );
  if (directResponse.ok) {
    const directEvent: EventData = await directResponse.json();
    eventId = directEvent.id;
    eventTitle = directEvent.title;
  } else if (eventSlug.includes("--")) {
    // Handle title--ID legacy format
    eventId = extractEventIdFromSlug(eventSlug);
    eventTitle = eventSlug.split("--")[0].replace(/-/g, " ");
  } else {
    // Fallback to title slug lookup
    const eventInfo = await findEventByTitleSlug(eventSlug);
    if (!eventInfo) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-2">Event not found.</p>
            <p className="text-gray-600 text-sm">Looking for: {eventSlug}</p>
            <p className="text-gray-500 text-xs mt-2">
              Make sure the event title matches exactly in the URL.
            </p>
          </div>
        </div>
      );
    }
    eventId = eventInfo.id;
    eventTitle = eventInfo.title;
  }

  // Fetch event data & sessions
  const [eventResponse, sessions] = await Promise.all([
    fetch(`https://api.blocstage.com/events/${eventId}`),
    fetchEventSessions(eventId),
  ]);

  if (!eventResponse.ok) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Event not found.</p>
      </div>
    );
  }

  const event: EventData = await eventResponse.json();
  const eventWithSessions = { ...event, sessions };

  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTimeRange = `${startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} - ${endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  return (
    <div className=" bg-gray-50">
      {/* <Header2 /> */}

      <main className="container mx-auto max-w-7xl lg:pt-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Banner Image */}
          <div className="relative h-64 sm:h-80 lg:h-96 w-full">
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-xl"
                sizes="(max-width: 1200px) 100vw, 80vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {event.title}
                </h2>
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              {event.title}
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 gap-y-2 sm:gap-x-8">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-600" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-600" />
                <span>{formattedTimeRange}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-600" />
                <span className="break-words">{event.location}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href={pageRoutes.buyTicketsPage(event.id)}
                className="w-full sm:w-auto"
              >
                <button className="bg-[#0C2D48] text-white px-6 py-2 rounded-md hover:bg-[#0C2D48] transition-colors font-semibold w-full sm:w-auto">
                  Get Tickets
                </button>
              </a>
              <ShareButton
                eventTitle={event.title}
                eventDescription={event.description}
                eventUrl={
                  typeof window !== "undefined" ? window.location.href : ""
                }
              />
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {/* About Event */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About Event
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Agenda & Speakers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Agenda & Speakers
                  </h2>
                  {eventWithSessions.sessions.length > 0 && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {eventWithSessions.sessions.length} session
                      {eventWithSessions.sessions.length !== 1 && "s"}
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {eventWithSessions.sessions.length > 0 ? (
                    eventWithSessions.sessions.map((session, index) => (
                      <SpeakerCard
                        key={index}
                        sessionTitle={session.title}
                        speakerName={session.speaker_name}
                        startTime={new Date(
                          session.start_time
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                        endTime={new Date(session.end_time).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                        speakerImageUrl={session.image_url}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-2">
                        No agenda items available.
                      </p>
                      <p className="text-sm text-gray-500">
                        Sessions will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
