"use client";
import BuyTicketPage from "@/components/BuyTicketPage";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";

const BuyTicket = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId') || '1'; // Default to '1' for testing

  return (
    <div className="">
      {/* <Header /> */}
      <BuyTicketPage eventId={eventId} />
    </div>
  );
};

export default BuyTicket;

