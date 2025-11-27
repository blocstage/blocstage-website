"use client";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useRefundTicketModal } from "../../../store/modalStore";

const RefundTicketModal = () => {
  const { isModalOpen, closeModal } = useRefundTicketModal();
  return (
    <Dialog.Root open={isModalOpen} onOpenChange={(o) => !o && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content
          className="fixed z-50 bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2 focus:outline-none"
        >
          <Dialog.Title className="text-lg font-semibold mb-2">
            Request Refund
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Please confirm your request for a refund. This process may take up
            to 3 working days.
          </Dialog.Description>

          <form className="flex flex-col gap-4">
            <select
              className="border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#4F4F4F] placeholder:text-[#4F4F4F]"
              name="refundReason"
              id="refundReason"
            >
              <option value="">Select option</option>
            </select>
            <textarea
              placeholder="Reason for refund..."
              className="border border-gray-300 rounded-md p-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-[#092C4C] text-white rounded-md hover:bg-[#092C4C]"
              >
                Submit
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              {/* <Cross2Icon /> */}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RefundTicketModal;
