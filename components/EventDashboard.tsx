/* eslint-disable react-hooks/exhaustive-deps */
// components/EventDashboard.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSlug } from "@/lib/slugUtils";
import { MapPin, Ticket, CalendarDays, Bell, DollarSign } from "lucide-react";
import Link from "next/link";
import { pageRoutes } from "../utils/pageRoutes";
import { capitalizeWords, getGreeting } from "../utils/helpers";

// Event type for user's events
type Event = {
  id: string;
  image_url?: string;
  title: string;
  type: string;
  start_time: string;
  location: string;
  tickets_sold?: number;
  revenue?: number;
  status?: string;
  category?: string;
  short_code?: string;
};

type EventOverview = {
  totalEventsCreated: number;
  totalTicketsSold: number;
  totalRevenueGenerated: number;
};

interface UserData {
  name: string;
  email: string;
}

const EventDashboard = () => {
  const greeting = getGreeting();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventOverview, setEventOverview] = useState<EventOverview | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [userData, setUserData] = useState<UserData>({
    name: "User",
    email: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await fetch("https://api.blocstage.com/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setUserData({
            name: user.name || user.full_name || user.username || "User",
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Check if user is logged in
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          setError("Please log in to view your events.");
          setLoading(false);
          router.push(pageRoutes.login);
          return;
        }

        // Fetch organizer's events with pagination
        const eventResponse = await fetch(
          `https://api.blocstage.com/events/organizer?page=${currentPage}&limit=20`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!eventResponse.ok) {
          const errorText = await eventResponse.text();
          console.error("❌ API Error Response:", errorText);

          if (eventResponse.status === 401) {
            setError("Authentication failed. Please log in again.");
            router.push(pageRoutes.login);
          } else {
            setError(`Server error: ${eventResponse.status} - ${errorText}`);
          }
          return;
        }

        const eventData = await eventResponse.json();

        // If it's the first page, replace events, otherwise append
        if (currentPage === 1) {
          setEvents(eventData);
        } else {
          setEvents((prevEvents) => [...prevEvents, ...eventData]);
        }

        // Check if there are more events (assuming API returns less than limit if no more)
        setHasMoreEvents(eventData.length === 20);

        // Fetch analytics data for all events
        const allEvents =
          currentPage === 1 ? eventData : [...events, ...eventData];
        const analyticsPromises = allEvents.map(async (event: Event) => {
          const analytics = await fetchEventAnalytics(event.id);
          return {
            ...event,
            tickets_sold: Number(analytics.total_tickets_sold) || 0,
            revenue: Number(analytics.total_revenue) || 0,
          };
        });

        const eventsWithAnalytics = await Promise.all(analyticsPromises);

        // Update events with analytics data
        setEvents(eventsWithAnalytics);

        // Calculate event overview data using analytics data
        const overview = {
          totalEventsCreated: eventsWithAnalytics.length,
          totalTicketsSold: eventsWithAnalytics.reduce(
            (sum: number, event: Event) =>
              sum + Number(event.tickets_sold || 0),
            0
          ),
          totalRevenueGenerated: eventsWithAnalytics.reduce(
            (sum: number, event: Event) => sum + Number(event.revenue || 0),
            0
          ),
        };

        setEventOverview(overview);
      } catch (e) {
        console.error("❌ Exception caught:", e);
        setError(
          `Failed to fetch event data: ${
            e instanceof Error ? e.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [currentPage]);

  // Function to fetch individual event details using short_code
  const fetchEventByShortCode = async (shortCode: string) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to view event details.");
        router.push(pageRoutes.login);
        return null;
      }

      const response = await fetch(`https://api.blocstage.com/e/${shortCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  };

  // Function to fetch analytics data for an event
  const fetchEventAnalytics = async (eventId: string) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to view analytics.");
        router.push(pageRoutes.login);
        return { total_tickets_sold: 0, total_revenue: 0 };
      }

      const response = await fetch(
        `https://api.blocstage.com/events/${eventId}/analytics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        // If analytics endpoint fails, return default values
        return { total_tickets_sold: 0, total_revenue: 0 };
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching event analytics:", error);
      // Return default values if analytics fetch fails
      return { total_tickets_sold: 0, total_revenue: 0 };
    }
  };

  // Function to load more events
  const loadMoreEvents = async () => {
    if (loadingMore || !hasMoreEvents) return;

    setLoadingMore(true);
    try {
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (e) {
      console.error("Failed to load more events:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  // Function to refresh events data
  const refreshEvents = async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setEvents([]);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Please log in to view your events.");
        router.push(pageRoutes.login);
        return;
      }

      const eventResponse = await fetch(
        "https://api.blocstage.com/events/organizer?page=1&limit=20",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!eventResponse.ok) {
        if (eventResponse.status === 401) {
          setError("Authentication failed. Please log in again.");
          router.push(pageRoutes.login);
        } else {
          throw new Error(`HTTP error! status: ${eventResponse.status}`);
        }
        return;
      }

      const eventData = await eventResponse.json();

      // Fetch analytics data for all events
      const analyticsPromises = eventData.map(async (event: Event) => {
        const analytics = await fetchEventAnalytics(event.id);
        return {
          ...event,
          tickets_sold: Number(analytics.total_tickets_sold) || 0,
          revenue: Number(analytics.total_revenue) || 0,
        };
      });

      const eventsWithAnalytics = await Promise.all(analyticsPromises);
      setEvents(eventsWithAnalytics);
      setHasMoreEvents(eventsWithAnalytics.length === 20);

      setEventOverview({
        totalEventsCreated: eventsWithAnalytics.length,
        totalTicketsSold: eventsWithAnalytics.reduce(
          (sum: number, event: Event) => sum + Number(event.tickets_sold || 0),
          0
        ),
        totalRevenueGenerated: eventsWithAnalytics.reduce(
          (sum: number, event: Event) => sum + Number(event.revenue || 0),
          0
        ),
      });
    } catch (e) {
      setError("Failed to refresh event data.");
      console.error("Failed to refresh event data:", e);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    switch (activeTab) {
      case "Upcoming":
        return events.filter((event) => {
          const isUpcoming = new Date(event.start_time) > now;
          const status = (event.status || "").toLowerCase();
          const isCancelled = status === "cancelled" || status === "canceled";
          return isUpcoming && !isCancelled;
        });
      case "Ended":
        return events.filter((event) => new Date(event.start_time) < now);
      case "Cancelled":
        return events.filter(
          (event) =>
            (event.status || "").toLowerCase() === "cancelled" ||
            (event.status || "").toLowerCase() === "canceled"
        );
      case "All Events":
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border[#F4511E] border-gray-200 rounded-full animate-spin mb-4 mx-auto"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-[#092C4C] text-white rounded hover:bg-[#0a3a5c]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red300">
      {/* Greeting and "Create Event" button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-4 sm:space-y-0">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-[#092C4C] mb-2 line-clamp-1">
            Good {greeting}, {capitalizeWords(userData?.name || "")}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            It&apos;s time to create and manage event
          </p>
        </div>
        <Link href={pageRoutes.createEvent} passHref legacyBehavior>
          <Button className="bg-[#0C2D48] text-white w-full sm:w-auto">
            Create Event
          </Button>
        </Link>
      </div>
      {/* Event Overview Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-[#282828] mb-4">
          Event Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="flex items-center p-4 sm:p-6 bg-[#F8F8F8] rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#FBEAE4] rounded-full mr-3 sm:mr-4">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-[#F4511E]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {eventOverview?.totalEventsCreated ?? 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Total Events Created
              </p>
            </div>
          </Card>
          <Card className="flex items-center p-4 sm:p-6 bg-[#F8F8F8] rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-3 sm:mr-4">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-[#092C4C]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {eventOverview?.totalTicketsSold ?? 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Total Ticket Sold
              </p>
            </div>
          </Card>
          <Card className="flex items-center p-4 sm:p-6 bg-[#F8F8F8] rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-3 sm:mr-4">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#092C4C]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {Number(
                  eventOverview?.totalRevenueGenerated ?? 0
                ).toLocaleString()}{" "}
                USDC
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Total Revenue Generated
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Event List Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#282828] mb-4">
          Events
        </h2>
        {/* Tabs for filtering events */}
        <div className="flex flex-wrap space-x-2 sm:space-x-4 mb-4 sm:mb-6 text-gray-600">
          <button
            onClick={() => setActiveTab("Upcoming")}
            className={`font-semibold text-sm sm:text-base px-2 py-1 ${
              activeTab === "Upcoming"
                ? "text-[#F4511E] border-b-2 border-[#F4511E]"
                : "hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("All Events")}
            className={`font-semibold text-sm sm:text-base px-2 py-1 ${
              activeTab === "All Events"
                ? "text-[#F4511E] border-b-2 border-[#F4511E]"
                : "hover:text-gray-800"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab("Published")}
            className={`font-semibold text-sm sm:text-base px-2 py-1 ${
              activeTab === "Published"
                ? "text-[#F4511E] border-b-2 border-[#F4511E]"
                : "hover:text-gray-800"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveTab("Ended")}
            className={`font-semibold text-sm sm:text-base px-2 py-1 ${
              activeTab === "Ended"
                ? "text-[#F4511E] border-b-2 border-[#F4511E]"
                : "hover:text-gray-800"
            }`}
          >
            Ended
          </button>
          <button
            onClick={() => setActiveTab("Cancelled")}
            className={`font-semibold text-sm sm:text-base px-2 py-1 ${
              activeTab === "Cancelled"
                ? "text-[#F4511E] border-b-2 border-[#F4511E]"
                : "hover:text-gray-800"
            }`}
          >
            Cancelled
          </button>
        </div>

        {filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id} // Use the unique ID as the key
                  className="rounded-lg shadow-md overflow-hidden"
                >
                  <CardHeader className="p-0 relative">
                    <Image
                      src={event.image_url || "/images/placeholder.png"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className="absolute top-2 left-2 text-sm rounded-md p-2"
                      style={{
                        backgroundColor: "#FBEAE4",
                        color: "#F4511E",
                        opacity: 0.8,
                      }}
                    >
                      {event.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(event.start_time).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="flex items-center text-[#F4511E] mr-1">
                        <Ticket className="w-5 h-5 mr-1" />
                        <span className="text-sm font-semibold">
                          {event.tickets_sold ?? 0}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        Tickets sold
                      </span>
                    </div>
                    <div className="space-y-2 mt-4">
                      {/* <Link href={`/events/${event.short_code || `${createSlug(event.title)}--${event.id}`}/preview`} passHref legacyBehavior> */}
                      <Link
                        href={pageRoutes.previewEvent(event)}
                        passHref
                        legacyBehavior
                      >
                        <Button className="w-full bg-[#0C2D48] text-white hover:bg-[#0C2D48]">
                          View Event
                        </Button>
                      </Link>
                      {/* <Link href={`/events/${event.id}/edit`} passHref legacyBehavior> */}
                      <Link
                        href={pageRoutes.editEvent(event.id)}
                        passHref
                        legacyBehavior
                      >
                        <Button className="w-full bg-[#F4511E] text-white hover:bg-[#e03e0c]">
                          Edit Event
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreEvents && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={loadMoreEvents}
                  disabled={loadingMore}
                  className="bg-[#0C2D48] text-white hover:bg-[#0C2D48] px-8 py-3"
                >
                  {loadingMore ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    "Load More Events"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold text-gray-900">
              No {activeTab} Events
            </p>
            <p className="text-gray-500 mb-6">Create an event today!</p>
            <Link href={pageRoutes.createEvent} passHref legacyBehavior>
              <Button className="bg-[#0C2D48] text-white hover:bg-[#0C2D48]">
                Create Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDashboard;
