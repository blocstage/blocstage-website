"use client";
import EventDashboard from "@/components/EventDashboard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const viewEvent = () => {
  return (
    <div className="flex min-h-screen flex-col">
        <Header />
        <div className="hidden md:block">
          <Sidebar />
        </div>
      <main className="flex-1 py-20">
       <EventDashboard />
      
      </main>
      {/* <Footer /> */}
    </div>
  );
    };
  
  export default viewEvent;
