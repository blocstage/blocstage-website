"use client";
import { Bell, Menu } from "lucide-react";
import React from "react";
import Logo from "../Logo";
import { useSideBarStore } from "../../store/SideBarStore";
import { usePathname } from "next/navigation";
import { pageRoutes } from "../../utils/pageRoutes";

const DashboardHeader = () => {
  const { toggleSideBar } = useSideBarStore();
  const pathname = usePathname();
  const { createEvent, editProfile, editEvent, events, previewEvent } =
    pageRoutes;

  console.log(pathname);

  const setHeaderTitle = () => {
    switch (true) {
      case pathname === createEvent:
      case pathname === events:
      case pathname.includes(editEvent("")):
      case pathname.includes(previewEvent({ title: "", id: "" })):
        return "Event";
      case pathname === editProfile:
        return "Profile";

      default:
        return "Event";
    }
  };

  return (
    <header>
      <div className="flex justify-between items-end md:hidden pb-6">
        <Logo />
        <div className="flex items-end ">
          <Menu size={24} onClick={toggleSideBar} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold md:text-2xl">{setHeaderTitle()}</h2>
        <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer max-md:hidden">
          <Bell className="w-5 h-4 sm:w-6 sm:h-5 text-[#092C4C]" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
