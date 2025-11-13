"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, QrCode } from "lucide-react";
import React from "react";
import Image from "next/image";
import RefundTicketModal from "./RefundTicketModal";
import { useRefundTicketModal } from "../../../store/modalStore";

const TicketCard = () => {
  const { openModal } = useRefundTicketModal();

  return (
    <>
      <div className="max-w-[706px] bg-white rounded-[8px] sm:rounded-[16px] px-3 sm:px-[18px] py-4">
        <div className="flex justify-between items-center">
          <p className="text-xs sm:text-sm text-[#E04E1E] font-medium bg-[#FBEAE4] rounded-[4px] px-[10px] py-[5px]">
            Non-Refundable
          </p>

          <div className="flex items-center gap-4">
            <div className="font-bold max-sm:text-sm">#5,500</div>
            {/* Dropdown Trigger */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-md">
                  <EllipsisVertical size={20} className="text-[#828282]" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-white rounded-md shadow-lg p-1 border border-gray-100"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#FBEAE4] rounded cursor-pointer">
                    Download Ticket
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    onSelect={openModal}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#FBEAE4] rounded cursor-pointer"
                  >
                    Request Refund
                  </DropdownMenu.Item>

                  <DropdownMenu.Arrow className="fill-white" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        <h3 className="max-sm:text-center font-bold text-sm md:text-lg line-clamp-1 max-sm:my-4 mt-2 mb-[14px]">
          Digital Assets Week Lagos
        </h3>

        <div className="max-sm:text-center flex max-sm:flex-col sm:justify-between sm:items-end sm:gap-[50px] lg:gap-[100px]">
          <div className="text-sm">
            <div className="mb-1">
              <p className="font-light text-[#282828]">Venue</p>
              <p className="font-bold mt-2 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
                rem?
              </p>
            </div>
            <div className="flex flex-col justify-between sm:flex-row gap-3 mt-3">
              <div>
                <p className="font-light text-[#282828]">Date</p>
                <p className="max-sm:font-bold">Mon, 25th Dec, 2023</p>
              </div>
              <div className="sm:text-end">
                <p className="font-light text-[#282828]">Time</p>
                <p className="max-sm:font-bold">7:00 AM - 5:00 PM WAT</p>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-2 max-sm:mt-4">
            <div>
              <div className="font-bold text-2xl">3246</div>
              <div className="w-[80px] sm:w-[100px]">
                <Image
                  className="w-full h-full object-contain"
                  src="/images/logodashboard.svg"
                  alt="blocStage"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="h-[100px] w-[100px]">
              <QrCode size={110} />
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      <RefundTicketModal />
    </>
  );
};

export default TicketCard;
