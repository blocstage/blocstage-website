"use client";
import { Bell, Menu } from "lucide-react";
import React from "react";
import Logo from "../Logo";
import { useSideBarStore } from "../../store/SideBarStore";

const DashboardHeader = () => {
  const { toggleSideBar } = useSideBarStore();

  return (
    <header>
      <div className="flex justify-between items-end md:hidden pb-6">
        <Logo />
        <div className="flex items-end ">
          <Menu size={24} onClick={toggleSideBar} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold md:text-2xl">Event</h2>
        <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer max-md:hidden">
          <Bell className="w-5 h-4 sm:w-6 sm:h-5 text-[#092C4C]" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
