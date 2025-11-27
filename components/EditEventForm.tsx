/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
// import AgendaScheduleForm from "../AgendaScheduleForm";
import { validateDateTimeRange, showDateTimeAlert } from "@/lib/dateValidation";
import LocationMap from "./LocationMap";
import { pageRoutes } from "../utils/pageRoutes";
import AgendaScheduleForm from "./AgendaScheduleForm";

// Event data type
export interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string[];
  isOnline: boolean;
  start_time: string;
  tags?: string[];
  end_time: string;
  image?: File | null;
  image_url?: string;
  sessions?: Session[];
}

interface Session {
  id?: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  speaker_name: string;
  session_order: number;
  image_url?: string;
}

interface EditEventFormProps {
  eventId: string;
}

// Reusable TagInput Component
interface TagInputProps {
  label: string;
  value: string[];
  allOptions: string[];
  onUpdate: (tags: string[]) => void;
  placeholder: string;
}

const TagInput = ({
  label,
  value,
  allOptions,
  onUpdate,
  placeholder,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestedOptions, setSuggestedOptions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setInputValue(term);
    if (term.length > 0) {
      const filtered = allOptions.filter(
        (option) =>
          option.toLowerCase().includes(term.toLowerCase()) &&
          !value.includes(option)
      );
      setSuggestedOptions(filtered);
    } else {
      setSuggestedOptions([]);
    }
  };

  const handleAddTag = (tag: string) => {
    const newTags = [...value, tag];
    onUpdate(newTags);
    setInputValue("");
    setSuggestedOptions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onUpdate(newTags);
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
        {label}
      </label>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full"
        />
        {suggestedOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestedOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleAddTag(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {value.map((tag: string) => (
            <Badge
              key={tag}
              variant="default"
              className="bg-[#092C4C] text-white flex items-center"
            >
              <span>{tag}</span>
              <X
                className="ml-1 w-4 h-4 cursor-pointer hover:text-gray-300"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EditEventForm({ eventId }: EditEventFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState<EventData>({
    id: eventId,
    title: "",
    description: "",
    location: "",
    category: [],
    isOnline: false,
    start_time: "",
    end_time: "",
    tags: [],
    sessions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({ username: "User" });
  const router = useRouter();

  const steps = [
    { title: "Event Details", description: "Basic event information" },
    { title: "Agenda & Sessions", description: "Event schedule and sessions" },
    { title: "Review & Save", description: "Review and save changes" },
  ];

  const allCategories = [
    "Tech Event",
    "Conference",
    "Meetup",
    "Workshop",
    "Concert",
    "Art Exhibition",
    "Sports Event",
    "Web3 Event",
  ];
  const allTags = [
    "Music",
    "Networking",
    "Workshop",
    "Hackathon",
    "Codelab",
    "Web3",
    "Health",
    "Fitness",
    "Art",
    "Technology",
    "Education",
    "Business",
    "Startup",
    "Food & Drink",
    "Travel",
    "Photography",
  ];

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("Please log in to edit events.");
          router.push("/login");
          return;
        }

        const response = await fetch(
          `https://api.blocstage.com/events/${eventId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Authentication failed. Please log in again.");
            router.push(pageRoutes.login);
            return;
          }
          const errorText = await response.text();
          console.error("Failed to fetch event data:", errorText);
          throw new Error(
            `Failed to load event: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const data = await response.json();

        setEventData({
          id: data.id,
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          category: Array.isArray(data.category)
            ? data.category
            : data.category
            ? [data.category]
            : [],
          isOnline: data.isOnline || false,
          start_time: data.start_time || "",
          end_time: data.end_time || "",
          tags: data.tags || [],
          image_url: data.image_url || data.banner_image_url,
          sessions: data.sessions || [],
        });
      } catch (e: any) {
        console.error("Failed to fetch event data:", e);
        setError(`Failed to load event: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

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
            username:
              user.username ||
              user.name ||
              user.full_name ||
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              "User",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (update: Partial<EventData>) => {
    // Validate date/time if updating start_time or end_time

    setEventData((prev) => ({ ...prev, ...update }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepUpdate = (update: Partial<EventData>) => {
    setEventData((prev) => ({ ...prev, ...update }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Please log in to save changes.");
        router.push(pageRoutes.login);
        return;
      }

      // Validate required fields
      if (!eventData.title.trim()) {
        setError("Event title is required");
        return;
      }
      if (!eventData.description.trim()) {
        setError("Event description is required");
        return;
      }
      if (!eventData.location.trim()) {
        setError("Event location is required");
        return;
      }
      if (!eventData.start_time) {
        setError("Event start time is required");
        return;
      }
      if (!eventData.end_time) {
        setError("Event end time is required");
        return;
      }

      // Prepare payload
      const payload = {
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        location: eventData.location.trim(),
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        category: eventData.category.length > 0 ? eventData.category[0] : "",
        tags: eventData.tags || [],
        isOnline: eventData.isOnline,
        image_url: eventData.image_url || null,
        sessions: eventData.sessions || [],
      };

      const response = await fetch(
        `https://api.blocstage.com/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please log in again.");
          router.push(pageRoutes.login);
          return;
        }
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to update event: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const responseData = await response.json();

      alert("Event updated successfully!");
      router.push(pageRoutes.events);
    } catch (e: any) {
      console.error("Error updating event:", e);
      setError(`Failed to update event: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 bordr-[#F4511E] border-gray-200 rounded-full animate-spin mb-4 mx-auto"></div>
          <p>Loading event details...</p>
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

  // Step indicator component
  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? "bg-[#092C4C] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-[#092C4C]">
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  index < currentStep ? "bg-[#092C4C]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        {/* <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-4">
          <a href="/viewevent" className="hover:underline">
            <span className="text-orange-500">Event</span>
          </a>
          <span>/</span>
          <span>Edit Event</span>
        </div> */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            {/* <h1 className="text-xl sm:text-2xl font-bold text-[#092C4C] mb-2">
              Hi {userData.username}!
            </h1> */}
            <p className="text-sm sm:text-base text-gray-600">
              Edit your event details
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Step Content */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        {currentStep === 0 && (
          <div>
            <h2 className="text-lg font-light text-gray-900 mb-6">
              Event Details
            </h2>

            {/* Event Name */}
            <div className="grid grid-cols-1 mt-8">
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Event Name
              </label>
              <Input
                value={eventData.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                placeholder="BTS Watch Party: Purple Night Edition"
                className="w-full"
              />
            </div>

            {/* Event Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Event Description
              </label>
              <Textarea
                value={eventData.description}
                onChange={(e) => handleChange({ description: e.target.value })}
                placeholder="Join fellow ARMYs for a night of music, fun, and unforgettable BTS moments!"
                rows={8}
                className="w-full"
              />
            </div>

            {/* Location */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Location
              </label>
              <LocationMap
                value={eventData.location}
                onChange={(location) => handleChange({ location })}
                placeholder="Search for locations in Nigeria..."
                className="w-full"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={eventData.isOnline}
                  onCheckedChange={(checked) =>
                    handleChange({ isOnline: checked as boolean })
                  }
                  className={
                    eventData.isOnline
                      ? "bg-[#F56630] text-white hover:bg-[#F56630]"
                      : "bg-[#E4E7EC] text-gray-600 border-gray-300 hover:bg-gray-100"
                  }
                />
                <label htmlFor="online" className="text-sm text-gray-600">
                  Online Event
                </label>
              </div>
            </div>

            {/* Event Category */}
            <TagInput
              label="Event Category"
              value={eventData.category}
              allOptions={allCategories}
              onUpdate={(categories) => handleChange({ category: categories })}
              placeholder="Start typing to add event categories..."
            />

            {/* Dates */}
            <div className="grid grid-cols-1 mt-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                  Start Date & Time
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    step="1"
                    value={eventData.start_time}
                    onChange={(e) =>
                      handleChange({ start_time: e.target.value })
                    }
                    className="w-full"
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                  End Date & Time
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    step="1"
                    value={eventData.end_time}
                    onChange={(e) => handleChange({ end_time: e.target.value })}
                    className="w-full"
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tags */}
            <TagInput
              label="Tags"
              value={eventData.tags || []}
              allOptions={allTags}
              onUpdate={(tags) => handleChange({ tags })}
              placeholder="Start typing to add tags..."
            />
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <AgendaScheduleForm
              data={eventData}
              onUpdate={handleStepUpdate}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-light text-gray-900 mb-6">
              Review & Save Changes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">
                  Event Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <strong>Title:</strong> {eventData.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {eventData.description}
                  </p>
                  <p>
                    <strong>Location:</strong> {eventData.location}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {eventData.isOnline ? "Online Event" : "In-Person Event"}
                  </p>
                  <p>
                    <strong>Start:</strong> {eventData.start_time}
                  </p>
                  <p>
                    <strong>End:</strong> {eventData.end_time}
                  </p>
                  <p>
                    <strong>Categories:</strong> {eventData.category.join(", ")}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {eventData.tags?.join(", ") || "None"}
                  </p>
                </div>
              </div>

              {eventData.sessions && eventData.sessions.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Sessions ({eventData.sessions.length})
                  </h3>
                  <div className="space-y-2">
                    {eventData.sessions.map((session, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p>
                          <strong>{session.title}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.start_time} - {session.end_time}
                        </p>
                        {session.speaker_name && (
                          <p className="text-sm text-gray-600">
                            Speaker: {session.speaker_name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="px-6 py-2 bg-[#092C4C] text-white rounded-lg font-medium hover:bg-[#092C4C] flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#092C4C] text-white rounded-lg font-medium hover:bg-[#092C4C]"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
