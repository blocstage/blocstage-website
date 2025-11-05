import EventDetails from "@/components/EventDetails";
import Sidebar from"@/components/Sidebar";
// import Header from "@/components/Header";
import Image from "next/image";
import React from "react";
import ShareButton from "@/components/ShareButton";
import { EventData } from "@/components/EventDetailsForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Define the props for the page component
interface EventPageProps {
  params: {
    id: string; 
  };
}

// Generate static paths for each event
export async function generateStaticParams() {
  const response = await fetch('https://api.blocstage.com/events');
  const events: EventData[] = await response.json();
  return events.map((event) => ({
    id: event.id,
  }));
}

const EventPage = ({ params }: EventPageProps) => {
  const { id } = params;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 py-20 mt-12">
        <EventDetails eventId={id} />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default EventPage;