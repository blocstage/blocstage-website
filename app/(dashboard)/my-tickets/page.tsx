"use client";
import React, { useState } from "react";
import TicketCard from "../../../components/dashboard/tickets/TicketCard";
import Image from "next/image";

export default function Page() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const tab = [{ title: "Upcoming" }, { title: "Expired" }];

  return (
    <section className="pb-[50px]">
      <div className="flex mb-6 sm:mb-8">
        {tab.map((t, i) => (
          <button
            onClick={() => setActiveTab(t.title)}
            key={i}
            className={`sm:text-lg border-b py-1 px-2 duration-150 ${
              activeTab === t.title
                ? "text-[#E04E1E] font-bold border-[#E04E1E]"
                : "text-[#767676] border-[#B2B2B2]"
            } `}
          >
            {t.title}
          </button>
        ))}
      </div>
      {activeTab === "Upcoming" ? (
        <div className="flex flex-col gap-10">
          <TicketCard />
          <TicketCard />
          <TicketCard />
        </div>
      ) : (
        <div className="h-[150px] mt-40 md:mt-60 ">
          <Image
            className="w-full h-full object-contain"
            src="/images/no-tickets-illustration.svg"
            alt="No Tickets"
            width={400}
            height={300}
          />
        </div>
      )}
    </section>
  );
}
