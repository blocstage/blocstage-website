/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  CalendarDays,
  Ticket,
  DollarSign,
  ArrowLeft,
  Calendar,
  Bell,
} from 'lucide-react'; // Ensure you have lucide-react installed
import { pageRoutes } from '../utils/pageRoutes';

interface EventDetailsProps {
  eventId: string; // The ID of the event to display
}

// Define the expected structure of your event data from the API
interface Session {
  id: string;
  title: string;
  speaker_name: string;
  start_time: string;
  end_time: string;
  description?: string;
  image_url?: string;
}

interface EventData {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  total_tickets_sold: number;
  total_revenue: number;
  sessions?: Session[];
  // Add any other properties your API returns
}

// Define the expected structure for the overview cards
interface EventOverview {
  totalEventsCreated: number;
  totalTicketsSold: number;
  totalRevenueGenerated: number;
}


const EventDetails = ({ eventId }: EventDetailsProps) => {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eventOverview, setEventOverview] = useState<EventOverview | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Upcoming'); // Matches the initial state in the image
  const router = useRouter();

  // Function to fetch analytics data for the event
  const fetchEventAnalytics = async (eventId: string) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to view analytics.");
        router.push("/login");
        return { total_tickets_sold: 0, total_revenue: 0 };
      }

      const response = await fetch(`https://api.blocstage.com/events/${eventId}/analytics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

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

  // Function to fetch sessions for the event
  const fetchEventSessions = async (eventId: string) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to view sessions.");
        router.push("/login");
        return [];
      }

      const response = await fetch(`https://api.blocstage.com/events/${eventId}/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        // If sessions endpoint fails, return empty array
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching event sessions:", error);
      // Return empty array if sessions fetch fails
      return [];
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("Please log in to view event details.");
          router.push("/login");
          return;
        }

        // Fetch event data
        const response = await fetch(`https://api.blocstage.com/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError("Authentication failed. Please log in again.");
            router.push("/login");
            return;
          }
          // Attempt to read error message from body if available
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        
        const data: EventData = await response.json();
        setEventData(data);
        
        // Fetch analytics data for accurate ticket sales and revenue
        const analytics = await fetchEventAnalytics(eventId);
        
        // Fetch sessions data from dedicated endpoint
        const sessionsData = await fetchEventSessions(eventId);
        setSessions(sessionsData);
        
        // Populate event overview with analytics data
        setEventOverview({
          totalEventsCreated: 1, // This typically comes from a different aggregate API
          totalTicketsSold: Number(analytics.total_tickets_sold) || 0,
          totalRevenueGenerated: Number(analytics.total_revenue) || 0,
        });

      } catch (e: any) {
        console.error("Failed to fetch event data:", e);
        setError(`Failed to load event details: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEventData();
    } else {
      setLoading(false);
      setError("No event ID provided.");
    }

  }, [eventId]); // Depend on eventId so data refetches if ID changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Event not found.</p>
      </div>
    );
  }

  // Helper functions for date and time formatting
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formattedDate = formatDate(eventData.start_time);
  const formattedStartTime = formatTime(eventData.start_time);
  const formattedEndTime = formatTime(eventData.end_time);

  const handleCancelEvent = async () => {
    const userConfirmed = window.confirm("Are you sure you want to cancel this event? This action cannot be undone.");
    if (!userConfirmed) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to cancel the event.");
        router.push("/login");
        return;
      }

      const response = await fetch(`https://api.blocstage.com/events/${eventId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      alert("Event cancelled successfully.");
      router.push(pageRoutes.events);
    } catch (e: any) {
      console.error("Failed to cancel event:", e);
      alert(`Failed to cancel event: ${e.message}`);
    }
  };

  return (
    <div className="md:ml-64 max-w-6xl mx-auto px-8 py-8 bg-[#F8F8F8] min-h-screen p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Section (Back link and Bell icon) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 md:mb-0">
            <a href="/viewevent" className="hover:underline">
              Event
            </a>
            <span>/</span>
            <span className="font-semibold text-gray-700">Preview Event</span>
          </div>
          <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer flex-shrink-0 hover:bg-[#d0e0f5] transition-colors">
            <Bell className="w-6 h-5 text-[#092C4C]" />
          </div>
        </div>

        {/* Main Event Details Header */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#282828] mb-4 lg:mb-0">
              {eventData.title}
            </h1>
            <div className="flex flex-col gap-2">
            <a href={`/edit-event/${eventData.id}`}>
              <button className="bg-[#0C2D48] text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-[#092C4C] transition-colors self-start lg:self-auto">
                Edit Event Details
              </button>
            </a>
            <button onClick={handleCancelEvent} className="bg-[#E04E1E] text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-orange-600 transition-colors self-start lg:self-auto">
                Cancel Event
              </button>
            </div>
          </div>

          {/* Event Info - Date, Time, Location */}
          <div className="space-y-4 text-gray-700 text-base">
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{formattedStartTime} - {formattedEndTime}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
              <span className="font-medium">{eventData.location || "Online Event"}</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-3">Event Sessions</h3>
                {sessions && sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <div key={session.id || index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          {session.image_url && (
                            <img
                              src={session.image_url}
                              alt={session.speaker_name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{session.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{session.speaker_name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>
                                {new Date(session.start_time).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(session.end_time).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {session.description && (
                              <p className="text-sm text-gray-600 mt-2">{session.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No sessions scheduled for this event.</p>
                )}
              </div>
            </div>
          </div>

          {/* Event Tabs */}
          
        </div>

        {/* Event Overview Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-[#282828] mb-6">
            Event Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Event Type */}
            <div className="flex items-center p-6 bg-[#F8F8F8] rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FBEAE4] rounded-full mr-4 flex-shrink-0">
                <Ticket className="w-6 h-6 text-[#F4511E]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventOverview?.totalRevenueGenerated === 0 ? 'Free' : 'Paid'}
                </p>
                <p className="text-sm text-gray-500">Event Type</p>
              </div>
            </div>
            {/* Card: Total Ticket Sold */}
            <div className="flex items-center p-6 bg-[#F8F8F8] rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-4 flex-shrink-0">
                <Ticket className="w-6 h-6 text-[#092C4C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventOverview?.totalTicketsSold ?? 0}
                </p>
                <p className="text-sm text-gray-500">Total Ticket Sold</p>
              </div>
            </div>
            {/* Card: Total Revenue Generated */}
            <div className="flex items-center p-6 bg-[#F8F8F8] rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-4 flex-shrink-0">
                <DollarSign className="w-6 h-6 text-[#092C4C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Number(eventOverview?.totalRevenueGenerated ?? 0).toLocaleString()} USDC
                </p>
                <p className="text-sm text-gray-500">Total Revenue Generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;  