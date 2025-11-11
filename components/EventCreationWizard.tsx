"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import EventDetailsForm from "./EventDetailsForm";
import EventDetailsPreview from "./EventDetailsPreview";
// import AgendaScheduleForm from "./AgendaScheduleForm";
import TicketsForm from "./TicketsForm";
import EventPreview from "./EventPreview";
import { createSlug } from "@/lib/slugUtils";
import { pageRoutes } from "../utils/pageRoutes";
import AgendaScheduleForm from "./AgendaScheduleForm";

const steps = [
  { id: "details", title: "Event Details", completed: false },
  { id: "agenda", title: "Agenda & Schedule", completed: false },
  { id: "tickets", title: "Tickets", completed: false },
  { id: "preview", title: "Preview", completed: false },
  { id: "finalpreview", title: "FinalPreview", completed: false },
];

export default function EventCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState<any>({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    isOnline: false,
    image: null,
    category: [],
    tags: [],
    sessions: [
      {
        title: "",
        speaker_name: "",
        start_time: "",
        end_time: "",
      },
    ],
    tickets: [],
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const updateEventData = (data: any) => {
    setEventData((prev: any) => ({ ...prev, ...data }));
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };
  const uploadImageToCloudinary = async (imageFile: File) => {
    const cloudName = "dsohqp4d9"; // Your Cloudinary cloud name
    const unsignedUploadPreset = "blocstage"; // Your upload preset

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", unsignedUploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary upload failed:", errorData);
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error during Cloudinary upload:", error);
      throw error;
    }
  };
  const handlePublish = async () => {
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Authentication token not found. Please log in.");
        router.push(pageRoutes.login);
        return;
      }

      // 1. Upload image if it's a File
      let imageUrl = eventData.image;
      if (
        eventData.image &&
        typeof eventData.image === "object" &&
        (eventData.image as any) instanceof File
      ) {
        try {
          imageUrl = await uploadImageToCloudinary(eventData.image);
        } catch (error) {
          console.error("Failed to upload event banner image:", error);
          alert("Failed to upload event banner image. Please try again.");
          return;
        }
      } else if (typeof eventData.image === "string") {
        // If it's already a URL (from Cloudinary), use it directly
        imageUrl = eventData.image;
      }

      // 3. Build sessions payload
      const sessionsPayload = eventData.sessions
        .filter((session: any) => session.title && session.title.trim()) // Only include sessions with titles
        .map((session: any, index: number) => ({
          title: session.title?.trim() || "",
          start_time: session.start_time ? session.start_time : "",
          end_time: session.end_time ? session.end_time : "",
          speaker_name: session.speaker_name?.trim() || "",
          session_order: index,
          image_url: session.image_url || null,
        }));

      // 4. Validate required fields
      if (!eventData.title.trim()) {
        alert("Event title is required");
        return;
      }
      if (!eventData.description.trim()) {
        alert("Event description is required");
        return;
      }
      if (!eventData.location.trim()) {
        alert("Event location is required");
        return;
      }
      if (!eventData.start_time) {
        alert("Event start time is required");
        return;
      }
      if (!eventData.end_time) {
        alert("Event end time is required");
        return;
      }

      // 5. Build final payload
      const payload = {
        title: eventData.title?.trim() || "",
        description: eventData.description?.trim() || "",
        location: eventData.location?.trim() || "",
        start_time: eventData.start_time || "",
        end_time: eventData.end_time || "",
        category:
          Array.isArray(eventData.category) && eventData.category.length > 0
            ? eventData.category[0]
            : "",
        tags: Array.isArray(eventData.tags) ? eventData.tags : [],
        image_url: imageUrl || null,
        sessions: sessionsPayload,
      };

      // 6. Validate JSON serialization and clean data
      try {
        // Remove any undefined values and ensure all values are serializable
        const cleanPayload = JSON.parse(
          JSON.stringify(payload, (key, value) => {
            if (value === undefined) return null;
            if (typeof value === "string" && value.trim() === "") return null;
            return value;
          })
        );

        const jsonString = JSON.stringify(cleanPayload);

        // Update payload with cleaned version
        Object.assign(payload, cleanPayload);
      } catch (error) {
        console.error("JSON serialization error:", error);
        alert(
          "Error preparing data for submission. Please check all fields and try again."
        );
        return;
      }

      // 7. Send event creation request
      const response = await fetch("https://api.blocstage.com/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Event creation error response:", errorText);
        console.error("Request payload:", JSON.stringify(payload, null, 2));
        console.error("Response status:", response.status);
        console.error(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.status === 401) {
          alert("Authentication failed. Please log in again.");
          router.push(pageRoutes.login);
          return;
        }

        alert(
          `Failed to publish event: ${response.status} ${response.statusText}\n\nError details: ${errorText}`
        );
        throw new Error(
          `Failed to publish event: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();

      // Submit tickets if any exist
      if (eventData.tickets && eventData.tickets.length > 0) {
        try {
          for (const ticket of eventData.tickets) {
            const ticketPayload = {
              name: ticket.name,
              description: ticket.description,
              price: ticket.is_free ? "0.00" : ticket.price,
              currency: ticket.currency,
              is_free: ticket.is_free,
              total_supply: ticket.total_supply,
            };

            const ticketResponse = await fetch(
              `https://api.blocstage.com/events/${responseData.id}/tickets`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(ticketPayload),
              }
            );

            if (!ticketResponse.ok) {
              throw new Error(
                `Failed to create ticket: ${ticketResponse.statusText}`
              );
            }
          }
        } catch (ticketError) {
          console.error("Error submitting tickets:", ticketError);
          alert(
            "Event created but failed to submit tickets. You can add them later."
          );
        }
      }

      alert("Event published successfully!");
      const destination = pageRoutes.events;
      router.push(destination);
    } catch (error: any) {
      console.error("Error publishing event:", error);
      alert(error.message || "An error occurred while publishing the event.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:ml-64 max-w-6xl mx-auto px-8 py-8">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 border[#F4511E] border-gray-200 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Publishing your event...</p>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Event published successfully!
            </p>
            <p className="text-sm text-gray-500 text-center">
              Redirecting to your events page...
            </p>
          </div>
        </div>
      )}
      {/* Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-[#092C4C] font-bold mb-4">Create Event</h1>

        {/* <div className="flex items-center text-md text-gray-500">
          <a href="/viewevent" className="hover:underline">
          <span className="text-orange-500">Event</span>
          </a>
          <span className="mx-2">/</span>
          <span>Create Event</span>
        </div> */}
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between ">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(index)}
              >
                {/* Step Circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    index < currentStep
                      ? "bg-[#092C4C] border-[#092C4C] text-white"
                      : index === currentStep
                      ? "bg-white border-[#092C4C] text-[#092C4C]"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index < currentStep && <Check className="w-4 h-4" />}
                </div>
                {/* Step Name */}
                {/* <span className="mt-2 text-xs text-center text-gray-700 max-w-[80px]">
            {step.title}
          </span> */}
              </div>
              {/* Progress Bar */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 flex-row w-2.5 h-1.5 ${
                    index < currentStep ? "bg-[#092C4C]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className=" rounded-lg">
        <div className="p-2">
          {currentStep === 0 && (
            <EventDetailsForm
              data={eventData as any}
              onUpdate={updateEventData}
              onNext={handleNext}
            />
          )}

          {currentStep === 1 && (
            <EventDetailsPreview
              onBack={handleBack}
              onUpdate={updateEventData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <AgendaScheduleForm
              data={eventData}
              onUpdate={updateEventData}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
          {currentStep === 3 && (
            <TicketsForm
              data={eventData}
              onUpdate={updateEventData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <EventPreview
              data={eventData}
              onBack={handleBack}
              onPublish={handlePublish}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
