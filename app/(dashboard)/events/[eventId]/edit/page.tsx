"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EditEventForm from "@/components/EditEventForm";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/landing/Header";
import { pageRoutes } from "../../../../../utils/pageRoutes";
export const dynamic = "force-dynamic";

const EditEventPage = ({ params }: { params: { eventId: string } }) => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Please log in to edit events.");
      router.push(pageRoutes.login);
      return;
    }
  }, [router]);

  // Check if user is logged in before rendering
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (!authToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-[#F4511E] bordergray-200 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <EditEventForm eventId={params.eventId} />;
};

export default EditEventPage;
