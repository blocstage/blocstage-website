"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EditEventForm from "@/components/EditEventForm";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 mt-12">
        <EditEventForm eventId={params.eventId} />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default EditEventPage;
